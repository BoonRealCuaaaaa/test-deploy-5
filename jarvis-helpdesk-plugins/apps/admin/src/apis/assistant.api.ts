import { AxiosResponse } from 'axios';

import helpdeskPluginsApiAxios from '../libs/clients/axios/helpdesk-plugin-api';
import { IAssistantSettings } from '../libs/interfaces/ai-setting';

export const getAssistantByTeamId = async (teamId: string): Promise<AxiosResponse<IAssistantSettings>> => {
  //Now, the select team is not implemented. Therefore, we have to hardcode a teamId
  return helpdeskPluginsApiAxios.get(`/api/v1/assistants/teams/${teamId}`);
};
