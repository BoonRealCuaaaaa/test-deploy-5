import { AxiosResponse } from 'axios';

import helpdeskPluginsApiAxios from '../libs/clients/axios/helpdesk-plugin-api';
import { Integration } from '../libs/constants/integration';
import { IIntegrationPlatform } from '../libs/interfaces/ai-setting';

export const getIntegrationApi = (teamId: string): Promise<AxiosResponse<IIntegrationPlatform[]>> => {
  return helpdeskPluginsApiAxios.get(`/api/v1/integration-platforms?teamId=${teamId}`);
};

export const createIntegrationApi = ({
  data,
  teamId,
}: {
  teamId: string;
  data: { type: Integration; domain: string };
}): Promise<AxiosResponse<IIntegrationPlatform>> => {
  return helpdeskPluginsApiAxios.post('/api/v1/integration-platforms', { ...data, teamId: teamId });
};

export const updateIntegrationApi = ({
  integrationPlatformId,
  data,
}: {
  integrationPlatformId: string;
  data: { domain?: string; isEnable?: boolean };
}): Promise<AxiosResponse<{ updated: boolean; integrationPlatform: IIntegrationPlatform }>> => {
  return helpdeskPluginsApiAxios.patch(`/api/v1/integration-platforms/${integrationPlatformId}`, data);
};
