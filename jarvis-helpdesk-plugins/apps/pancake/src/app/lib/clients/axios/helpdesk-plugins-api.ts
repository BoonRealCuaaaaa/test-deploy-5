import axios, { AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

import { SHARED_APP_CONFIG } from '@/shared/lib/app-config';
import { StorageKey } from '@/shared/lib/constants/chrome';
import { ChromePersistStorage } from '@/shared/lib/helpers/chrome/persistent-storage';
import { AuthData } from '@/shared/lib/types/auth';

import { responseAuthErrorInterceptor, responseAuthInterceptor } from './stack-axios';

const helpdeskPluginsApiAxios = axios.create({
  baseURL: SHARED_APP_CONFIG.HELPDESK_PLUGINS_API_URL,
});

const requestAuthInterceptor = async (req: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const { accessToken } = (await ChromePersistStorage.getItem(StorageKey.AUTH_DATA)) as AuthData;

  if (accessToken) {
    return {
      ...req,
      headers: {
        ...req.headers,
        Authorization: `Bearer ${accessToken}`,
      } as AxiosRequestHeaders,
    };
  }

  return req as InternalAxiosRequestConfig;
};

helpdeskPluginsApiAxios.interceptors.request.use(requestAuthInterceptor);
helpdeskPluginsApiAxios.interceptors.response.use(responseAuthInterceptor, responseAuthErrorInterceptor);

export default helpdeskPluginsApiAxios;
