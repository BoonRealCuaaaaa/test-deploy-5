import axios, { AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

import { APP_CONFIG } from '../../app-config';
import { getToken } from '../../utils/get-auth-token';
import { getLastAccessedTeam } from '../../utils/get-team';

import { responseAuthErrorInterceptor, responseAuthInterceptor } from './stack-auth-api';

const helpdeskPluginsApiAxios = axios.create({
  baseURL: APP_CONFIG.HELPDESK_PLUGINS_API_URL,
});

const requestAuthInterceptor = (req: AxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getToken();
  const currentTeamId = getLastAccessedTeam();

  if (token) {
    return {
      ...req,
      headers: {
        ...req.headers,
        'team-id': currentTeamId,
        Authorization: `Bearer ${token}`,
      } as unknown as AxiosRequestHeaders,
    };
  }

  return req as InternalAxiosRequestConfig;
};

helpdeskPluginsApiAxios.interceptors.request.use(requestAuthInterceptor);
helpdeskPluginsApiAxios.interceptors.response.use(responseAuthInterceptor, responseAuthErrorInterceptor);

export default helpdeskPluginsApiAxios;
