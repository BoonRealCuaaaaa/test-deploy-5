import { AxiosResponse } from 'axios';

import helpdeskPluginsApiAxios from '../libs/clients/axios/helpdesk-plugin-api';
import { ITeam } from '../libs/interfaces/team';

export const getTeamApi = (): Promise<AxiosResponse<ITeam[]>> => {
  return helpdeskPluginsApiAxios.get(`/api/v1/teams`);
};

export const addTeamApi = ({ displayName }: { displayName: string }): Promise<AxiosResponse<any>> => {
  return helpdeskPluginsApiAxios.post(`/api/v1/teams`, {
    displayName,
  });
};

export const updateTeamApi = ({
  teamId,
  displayName,
}: {
  teamId: string;
  displayName: string;
}): Promise<AxiosResponse<any>> => {
  return helpdeskPluginsApiAxios.patch(`/api/v1/teams/${teamId}`, {
    displayName,
  });
};

export const deleteTeamApi = (teamId: string): Promise<AxiosResponse<any>> => {
  return helpdeskPluginsApiAxios.delete(`/api/v1/teams/${teamId}`);
};

export const getTeamMemberApi = async (
  teamId: string,
  searchParams: URLSearchParams
): Promise<
  AxiosResponse<{
    items: {
      userId: string;
      role: string;
      display_name: string | null;
      profile_image_url: string | null;
      email: string;
    }[];
    total: number;
    role: string;
    current_user_id: string;
  }>
> => {
  return helpdeskPluginsApiAxios.get(`/api/v1/teams/${teamId}/members-profile?${searchParams.toString()}`);
};

export const inviteTeamMemberApi = async ({
  teamId,
  email,
}: {
  teamId: string;
  email: string;
}): Promise<AxiosResponse<any>> => {
  const res = await helpdeskPluginsApiAxios.post(`/api/v1/teams/${teamId}/members/invite/send-email`, {
    email: email,
  });
  return res;
};

export const removeTeamMemberApi = async ({
  teamId,
  memberId,
}: {
  teamId: string;
  memberId: string;
}): Promise<AxiosResponse<any>> => {
  const res = await helpdeskPluginsApiAxios.delete(`/api/v1/teams/${teamId}/${memberId}`);
  return res;
};

export const acceptTeamInvitationApi = async (code: string): Promise<AxiosResponse<any>> => {
  const res = await helpdeskPluginsApiAxios.post(`/api/v1/teams/members/invite/accept`, {
    code: code,
  });
  return res;
};
