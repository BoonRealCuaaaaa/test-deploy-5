import axios, { AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

import { SHARED_APP_CONFIG } from '../../app-config';

import { responseAuthErrorInterceptor, responseAuthInterceptor } from './stack-auth-api';

const helpdeskPluginsApiAxios = axios.create({
  baseURL: SHARED_APP_CONFIG.HELPDESK_PLUGINS_API_URL,
});

const requestAuthInterceptor = (req: AxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('access_token');

  if (token) {
    return {
      ...req,
      headers: {
        ...req.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders,
    };
  }

  return req as InternalAxiosRequestConfig;
};

helpdeskPluginsApiAxios.interceptors.request.use(requestAuthInterceptor);
helpdeskPluginsApiAxios.interceptors.response.use(responseAuthInterceptor, responseAuthErrorInterceptor);

export default helpdeskPluginsApiAxios;
