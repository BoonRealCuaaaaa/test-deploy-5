import { AxiosResponse } from 'axios';

import stackAuthApiAxios from '../libs/clients/axios/stack-auth-api';

export const getCurrentUser = async () => {
  return stackAuthApiAxios.get('/api/v1/users/me');
};

export const refresh = async (): Promise<AxiosResponse> => {
  return stackAuthApiAxios.post('/api/v1/auth/sessions/current/refresh', {});
};

export const logout = async () => {
  return stackAuthApiAxios.delete('/api/v1/auth/sessions/current');
};
