import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/shared/constants/roles';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { UUIDParam } from 'src/shared/decorators/params.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { HttpRequestContextService } from 'src/shared/modules/http-request-context/http-request-context.service';

import { AcceptInvitationDTO } from './dtos/accept-invotation.dto';
import { CreateTeamDto } from './dtos/create-team.dto';
import { SendEmailInviteMemberDTO } from './dtos/send-email-invite-user.dto';
import { UpdateTeamDto } from './dtos/update-team.dto';
import { TeamService } from './team.service';

@ApiTags('teams')
@Controller('teams')
@Auth()
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly httpReqContextService: HttpRequestContextService
  ) {}

  @Post()
  async create(@Body() body: CreateTeamDto) {
    return await this.teamService.create(
      this.httpReqContextService.getUserStackId()!,
      this.httpReqContextService.getUserId()!,
      {
        displayName: body.displayName,
      }
    );
  }

  @Patch(':teamId')
  @Roles(UserRole.ADMIN)
  async update(@UUIDParam('teamId') teamId: string, @Body() body: UpdateTeamDto) {
    return await this.teamService.update(teamId, {
      displayName: body.displayName,
    });
  }

  @Delete(':teamId')
  @Roles(UserRole.ADMIN)
  async delete(@UUIDParam('teamId') teamId: string) {
    return await this.teamService.delete(teamId);
  }

  @Get()
  async getTeams() {
    return await this.teamService.getTeams(this.httpReqContextService.getUserId()!);
  }

  @Get(':teamId/members')
  async getTeamMembers(
    @UUIDParam('teamId') teamId: string,
    @Query()
    query: {
      limit: number;
      offset: number;
    }
  ) {
    return await this.teamService.getTeamMembers(this.httpReqContextService.getUserId()!, teamId, {
      limit: query.limit || 5,
      offset: query.offset,
    });
  }

  @Post(':teamId/members/invite/send-email')
  async sendEmailToInvite(
    @UUIDParam('teamId') teamId: string,
    @Body()
    body: SendEmailInviteMemberDTO
  ) {
    return await this.teamService.sendEmailInviteMember(teamId, this.httpReqContextService.getUserId()!, body.email);
  }

  @Post('/members/invite/accept')
  async acceptInviteUser(
    @Body()
    body: AcceptInvitationDTO
  ) {
    return await this.teamService.acceptInvitation(this.httpReqContextService.getUserId()!, body.code);
  }

  @Get(':teamId/members-profile')
  async getTeamMembersProfile(
    @UUIDParam('teamId') teamId: string,
    @Query()
    query: {
      limit: number;
      offset: number;
    }
  ) {
    return await this.teamService.getTeamMembersProfile(this.httpReqContextService.getUserId()!, teamId, {
      limit: query.limit || 5,
      offset: query.offset || 0,
    });
  }

  @Roles(UserRole.ADMIN)
  @Delete(':teamId/:userId')
  async removeTeamMember(@UUIDParam('teamId') teamId: string, @UUIDParam('userId') userId: string) {
    return await this.teamService.removeTeamMember(teamId, userId, this.httpReqContextService.getUserId()!);
  }
}
