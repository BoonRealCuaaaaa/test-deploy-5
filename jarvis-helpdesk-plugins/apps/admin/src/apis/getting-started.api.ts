import { AxiosResponse } from 'axios';

import helpdeskPluginsApiAxios from '../libs/clients/axios/helpdesk-plugin-api';
import { IGettingStartedTask } from '../libs/interfaces/getting-started-task';

export const getGettingStartedTasksApi = async (teamId: string): Promise<AxiosResponse<IGettingStartedTask[]>> => {
  return helpdeskPluginsApiAxios.get(`api/v1/getting-started-tasks?teamId=${teamId}`);
};

export const getGettingStartedTaskByTaskNameApi = async ({
  teamId,
  name,
}: {
  teamId: string;
  name: string;
}): Promise<AxiosResponse<IGettingStartedTask>> => {
  return helpdeskPluginsApiAxios.get(`api/v1/getting-started-tasks/names/${name}?teamId=${teamId}`);
};

export const deleteGettingStartedTaskApi = (
  gettingStartedTaskId: string
): Promise<AxiosResponse<{ deleted: boolean; id: string }>> => {
  return helpdeskPluginsApiAxios.delete(`api/v1/getting-started-tasks/${gettingStartedTaskId}`);
};
