import { HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse, isAxiosError } from 'axios';

import { HttpRequestContextService } from '../http-request-context/http-request-context.service';

import { StackAuthCreateTeamRequest } from './interfaces/stack-auth-create-team-request';
import { StackAuthRequestHeaders } from './interfaces/stack-auth-request-headers';
import { StackAuthTeam } from './interfaces/stack-auth-team';
import { StackAuthTeamMemberProfile } from './interfaces/stack-auth-team-member-profile';
import { StackAuthUpdateTeamRequest } from './interfaces/stack-auth-update-team-request';
import { StackAuthUser } from './interfaces/stack-auth-user';

@Injectable()
export class StackAuthService {
  private readonly client: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpReqContextService: HttpRequestContextService
  ) {
    this.client = axios.create({
      baseURL: configService.getOrThrow('stackAuth.endpoint'),
      headers: {
        'X-Stack-Access-Type': 'client',
        'X-Stack-Project-Id': configService.getOrThrow('stackAuth.projectId'),
        'X-Stack-Publishable-Client-Key': configService.getOrThrow('stackAuth.publishableClientKey'),
      } as StackAuthRequestHeaders,
    });
  }

  private handleStackAuthApiError(error: any): never {
    if (isAxiosError(error) && error.status == HttpStatus.UNAUTHORIZED) {
      throw new UnauthorizedException();
    }
    throw new InternalServerErrorException();
  }

  async getMe(stackAuthAccessToken: string) {
    try {
      const res = await this.client.get<StackAuthUser>('/api/v1/users/me', {
        headers: {
          'X-Stack-Access-Token': stackAuthAccessToken,
        },
      });

      return res.data;
    } catch (error) {
      this.handleStackAuthApiError(error);
    }
  }

  async createTeam(stackAuthCreateTeamReq: StackAuthCreateTeamRequest) {
    try {
      const res = await this.client.post<StackAuthCreateTeamRequest, AxiosResponse<StackAuthTeam>>(
        '/api/v1/teams',
        {
          ...stackAuthCreateTeamReq,
        },
        {
          headers: {
            'X-Stack-Access-Token': this.httpReqContextService.getUser()?.stackAuthAccessToken,
          },
        }
      );

      return res.data;
    } catch (error) {
      this.handleStackAuthApiError(error);
    }
  }

  async updateTeam(teamId: string, stackAuthUpdateTeamReq: StackAuthCreateTeamRequest) {
    try {
      const res = await this.client.patch<StackAuthUpdateTeamRequest, AxiosResponse<StackAuthTeam>>(
        `/api/v1/teams/${teamId}`,
        stackAuthUpdateTeamReq,
        {
          headers: {
            'X-Stack-Access-Token': this.httpReqContextService.getUser()?.stackAuthAccessToken,
          },
        }
      );

      return res.data;
    } catch (error) {
      this.handleStackAuthApiError(error);
    }
  }

  async deleteTeam(teamId: string) {
    try {
      const res = await this.client.delete<{ success: boolean }>(`/api/v1/teams/${teamId}`, {
        headers: {
          'X-Stack-Access-Token': this.httpReqContextService.getUser()?.stackAuthAccessToken,
        },
      });

      return res.data;
    } catch (error) {
      this.handleStackAuthApiError(error);
    }
  }

  async sendEmailToInviteMember(teamId: string, email: string) {
    try {
      const res = await this.client.post<{ success: boolean }>(
        '/api/v1/team-invitations/send-code',
        {
          team_id: teamId,
          email: email,
          callback_url: this.configService.get('stackAuth.callbackUrl') as string,
        },
        {
          headers: {
            'X-Stack-Access-Token': this.httpReqContextService.getUser()?.stackAuthAccessToken,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.log(error);
      this.handleStackAuthApiError(error);
    }
  }

  async acceptInvitation(code: string) {
    try {
      const res = await this.client.post(
        '/api/v1/team-invitations/accept',
        {
          code: code,
        },
        {
          headers: {
            'X-Stack-Access-Token': this.httpReqContextService.getUser()?.stackAuthAccessToken,
          },
        }
      );

      return res.status;
    } catch (error) {
      console.log(error);
      this.handleStackAuthApiError(error);
    }
  }

  async removeTeamMember(teamId: string, memberId: string) {
    try {
      const res = await this.client.delete<{ success: boolean }>(`/api/v1/team-memberships/${teamId}/${memberId}`, {
        headers: {
          'X-Stack-Access-Token': this.httpReqContextService.getUser()?.stackAuthAccessToken,
        },
      });

      return res.data.success;
    } catch (error) {
      console.log(error);
      this.handleStackAuthApiError(error);
    }
  }

  async getTeamMemberProfile(teamId: string, memberId: string) {
    try {
      const res = await this.client.get<StackAuthTeamMemberProfile>(
        `/api/v1/team-member-profiles/${teamId}/${memberId}`,
        {
          headers: {
            'X-Stack-Access-Token': this.httpReqContextService.getUser()?.stackAuthAccessToken,
          },
        }
      );

      return res.data;
    } catch (error) {
      this.handleStackAuthApiError(error);
    }
  }

  async getTeamInvitationDetails(code: string) {
    try {
      const res = await this.client.post<{ team_id: string; team_display_name: string }>(
        '/api/v1/team-invitations/accept/details',
        {
          code: code,
        },
        {
          headers: {
            'X-Stack-Access-Token': this.httpReqContextService.getUser()?.stackAuthAccessToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      this.handleStackAuthApiError(error);
    }
  }

  async isValidInvitationCode(code: string) {
    try {
      const res = await this.client.post<{ is_valid_code: boolean }>(
        '/api/v1/team-invitations/accept/check-code',
        {
          code: code,
        },
        {
          headers: {
            'X-Stack-Access-Token': this.httpReqContextService.getUser()?.stackAuthAccessToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      this.handleStackAuthApiError(error);
    }
  }
}
