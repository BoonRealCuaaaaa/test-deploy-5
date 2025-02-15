import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

import { SHARED_APP_CONFIG } from '@/shared/lib/app-config';
import { StorageKey } from '@/shared/lib/constants/chrome';
import { getStorageData, setStorageData } from '@/shared/lib/helpers/chrome/persistent-storage';
import { AuthData } from '@/shared/lib/types/auth';
import { refresh } from '@/src/app/apis/auth';

export type StackAuthRequestHeaders = AxiosRequestHeaders & {
  'X-Stack-Access-Type': 'client' | 'server';
  'X-Stack-Project-Id': string;
  'X-Stack-Publishable-Client-Key': string;
  'X-Stack-Access-Token'?: string;
  'X-Stack-Refresh-Token'?: string;
};

const instance = axios.create({
  baseURL: `${SHARED_APP_CONFIG.STACK.API_URL}`,
});

const requestAuthInterceptor = async (req: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const isRefreshTokenReq = req.url?.includes('/auth/sessions/current/refresh');

  const tokens = await getStorageData<AuthData>(StorageKey.AUTH_DATA);
  const newReq = {
    ...req,
    headers: {
      ...req.headers,
      'X-Stack-Access-Type': 'client',
      'X-Stack-Publishable-Client-Key': SHARED_APP_CONFIG.STACK.PUBLISHABLE_CLIENT_KEY,
      'X-Stack-Project-Id': SHARED_APP_CONFIG.STACK.PROJECT_ID,
    } as StackAuthRequestHeaders,
  };

  newReq.headers.Authorization = `Bearer ${tokens?.accessToken == undefined ? '' : tokens.accessToken}`;

  if (!isRefreshTokenReq)
    newReq.headers['X-Stack-Access-Token'] = tokens?.accessToken == undefined ? '' : tokens.accessToken;
  newReq.headers['X-Stack-Refresh-Token'] = tokens?.refreshToken == undefined ? '' : tokens.refreshToken;

  return newReq as InternalAxiosRequestConfig;
};

export const responseAuthInterceptor = (res: AxiosResponse) => res;

export const responseAuthErrorInterceptor = async (error: AxiosError) => {
  const { response, config } = error;
  const status = response?.status;

  if (status === HttpStatusCode.Unauthorized && !(config as any)._unretryable) {
    const tokens = await getStorageData<AuthData>(StorageKey.AUTH_DATA);
    const refreshToken = tokens?.refreshToken;

    if (refreshToken) {
      try {
        const refreshResponse: { data: { access_token: string } } = await refresh();

        const { access_token: accessToken } = refreshResponse.data;

        if (refreshToken) {
          await setStorageData(StorageKey.AUTH_DATA, {
            accessToken,
            refreshToken,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (config as any)._unretryable = true;
          return await instance(config!);
        }
      } catch (refreshError) {
        await setStorageData(StorageKey.AUTH_DATA, undefined);
        window.location.href = SHARED_APP_CONFIG.STACK_AUTH_URL;
        return Promise.reject(refreshError);
      }
    }
  }

  return Promise.reject(error);
};

instance.interceptors.request.use(requestAuthInterceptor);
instance.interceptors.response.use(responseAuthInterceptor, responseAuthErrorInterceptor);

export default instance;
