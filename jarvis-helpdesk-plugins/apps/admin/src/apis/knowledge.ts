import { AxiosResponse } from 'axios';

import helpdeskPluginsApiAxios from '../libs/clients/axios/helpdesk-plugin-api';

export const getKnowledgeApi = (
  assistantId: string,
  searchParams: URLSearchParams
): Promise<
  AxiosResponse<{
    data: {
      id: string;
      knowledgeName: string;
      description: string;
      numUnits: number;
      updatedAt: string;
    }[];
    meta: { total: number };
  }>
> => {
  return helpdeskPluginsApiAxios.get(
    `/api/v1/assistant-knowledges/assistants/${assistantId}?${searchParams.toString()}`
  );
};

export const addKnowledgeApi = (
  assistantId: string,
  {
    name,
    description,
  }: {
    name: string;
    description: string;
  }
): Promise<AxiosResponse<any>> => {
  return helpdeskPluginsApiAxios.post(`/api/v1/assistant-knowledges/assistants/${assistantId}`, {
    name,
    description,
  });
};

export const updateKnowledgeApi = ({
  knowledgeId,
  name,
  description,
}: {
  knowledgeId: string;
  name: string;
  description: string;
}): Promise<AxiosResponse<any>> => {
  return helpdeskPluginsApiAxios.patch(`/api/v1/assistant-knowledges/${knowledgeId}`, {
    name,
    description,
  });
};

export const deleteKnowledgeApi = (knowledgeId: string): Promise<AxiosResponse<any>> => {
  return helpdeskPluginsApiAxios.delete(`/api/v1/assistant-knowledges/${knowledgeId}`);
};
