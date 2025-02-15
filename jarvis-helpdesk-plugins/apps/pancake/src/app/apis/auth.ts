import { AxiosResponse } from 'axios';

import helpdeskPluginsApiAxios from '../lib/clients/axios/helpdesk-plugins-api';
import stackAuthApiAxios from '../lib/clients/axios/stack-axios';

export const getCurrentUser = async () => {
  return stackAuthApiAxios.get('/api/v1/users/me');
};

export const refresh = async (): Promise<AxiosResponse> => {
  return stackAuthApiAxios.post('/api/v1/auth/sessions/current/refresh', {});
};

export const logout = async () => {
  return stackAuthApiAxios.delete('/api/v1/auth/sessions/current');
};

export const verifyDomain = async (domain: string) => {
  return await helpdeskPluginsApiAxios.get(`/api/v1/pancake/verify-domain/${domain}`);
};
