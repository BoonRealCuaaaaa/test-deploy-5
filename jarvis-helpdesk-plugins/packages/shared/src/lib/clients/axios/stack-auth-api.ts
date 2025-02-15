import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

import { refresh } from '@/shared/apis/auth';

import { SHARED_APP_CONFIG } from '../../app-config';
import { getRefreshToken, getToken } from '../../utils/get-auth-token';

export type StackAuthRequestHeaders = AxiosRequestHeaders & {
  'X-Stack-Access-Type': 'client' | 'server';
  'X-Stack-Project-Id': string;
  'X-Stack-Publishable-Client-Key': string;
  'X-Stack-Access-Token'?: string;
  'X-Stack-Refresh-Token'?: string;
};

const stackAuthApiAxios = axios.create({
  baseURL: `${SHARED_APP_CONFIG.STACK.API_URL}`,
});

const requestAuthInterceptor = (req: AxiosRequestConfig): InternalAxiosRequestConfig => {
  const isRefreshTokenReq = req.url?.includes('/auth/sessions/current/refresh');
  const isLogoutReq = req.url?.includes('/auth/sessions/current') && req.method === 'DELETE';

  const token = getToken();
  const refreshToken = getRefreshToken();

  if (token) {
    return {
      ...req,
      headers: {
        ...req.headers,
        Authorization: `Bearer ${token}`,
        'X-Stack-Access-Type': 'client',
        'X-Stack-Publishable-Client-Key': SHARED_APP_CONFIG.STACK.PUBLISHABLE_CLIENT_KEY,
        'X-Stack-Project-Id': SHARED_APP_CONFIG.STACK.PROJECT_ID,
        ...(!isRefreshTokenReq && !isLogoutReq && { 'X-Stack-Access-Token': token }),
        'X-Stack-Refresh-Token': refreshToken,
      } as StackAuthRequestHeaders,
    };
  }

  return req as InternalAxiosRequestConfig;
};

export const responseAuthInterceptor = (res: AxiosResponse) => res;

export const responseAuthErrorInterceptor = async (error: AxiosError) => {
  const { response, config } = error;
  const status = response?.status;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (status === HttpStatusCode.Unauthorized && !(config as any)._unretryable) {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      try {
        const refreshResponse = await refresh();

        const { access_token: accessToken } = refreshResponse.data as { access_token: string };

        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (config as any)._unretryable = true;
          return await stackAuthApiAxios(config!);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  }

  return Promise.reject(error);
};

stackAuthApiAxios.interceptors.request.use(requestAuthInterceptor);
stackAuthApiAxios.interceptors.response.use(responseAuthInterceptor, responseAuthErrorInterceptor);

export default stackAuthApiAxios;
