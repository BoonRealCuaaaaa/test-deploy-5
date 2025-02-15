import { HttpStatus, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PaginationHelpers from 'src/lib/helpers/pagination.helper';
import { AiAssistantService } from 'src/shared/modules/ai-assistant/ai-assistant.service';
import { StackAuthService } from 'src/shared/modules/stack-auth/stack-auth.service';
import { DataSource, In, Repository } from 'typeorm';

import { AssistantService } from '../assistant/assistant.service';
import { AIAssistant } from '../assistant/entities/assistant.entity';
import { TeamGettingStartedTask } from '../getting-started/entities/team-getting-started-task.entity';
import { GettingStartedTaskService } from '../getting-started/getting-started-task.service';
import { IntegrationPlatform } from '../integration-platform/entities/integration-platform.entity';
import { User } from '../user/entities/user.entity';

import { TeamRoleEnum } from './constants/team-role.enum';
import { Team } from './entities/team.entity';
import { TeamRole } from './entities/team-role.entity';

@Injectable()
export class TeamService {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly stackAuthService: StackAuthService,
    private readonly aiAssistantService: AiAssistantService,
    private readonly gettingStartedTaskService: GettingStartedTaskService,
    private readonly dataSource: DataSource,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(AIAssistant)
    private readonly aiAssistantRepository: Repository<AIAssistant>,
    @InjectRepository(TeamRole)
    private readonly teamRoleRepository: Repository<TeamRole>,
    @InjectRepository(IntegrationPlatform)
    private readonly integrationPlatformRepository: Repository<IntegrationPlatform>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TeamGettingStartedTask)
    private readonly teamGettingStartedTaskRepository: Repository<TeamGettingStartedTask>
  ) {}

  async create(userStackId: string, userId: string, { displayName }: { displayName: string }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const stackAuthTeam = await this.stackAuthService.createTeam({
      display_name: displayName,
      creator_user_id: userStackId,
    });
    const defaultAiAssistant = await this.aiAssistantService.createAssistant(`${displayName} Assistant`);

    let team = this.teamRepository.create({
      stackId: stackAuthTeam.id,
      displayName: stackAuthTeam.display_name,
    });

    const assistant = this.aiAssistantRepository.create({
      jarvisBotId: defaultAiAssistant.id,
    });
    const adminRole = this.teamRoleRepository.create({
      user: {
        id: userId,
      },
      role: TeamRoleEnum.ADMIN,
    });

    team.aiAssistants = [assistant];
    team.roles = [adminRole];
    team = await this.teamRepository.save(team);

    team.activateAssistantId = team.aiAssistants[0].id;
    team = await this.teamRepository.save(team);

    await this.assistantService.createAssistantConfig(team.activateAssistantId, userId);
    await this.gettingStartedTaskService.createDefaultIntegrationTasks(team.id);
    await this.gettingStartedTaskService.createDefaultRuleTasks(team.id);

    await queryRunner.commitTransaction();

    return {
      id: team.id,
      stackId: team.stackId,
      displayName: stackAuthTeam.display_name,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  async update(teamId: string, { displayName }: { displayName: string }) {
    const team = await this.teamRepository.findOne({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const updatedStackTeam = await this.stackAuthService.updateTeam(team.stackId, { display_name: displayName });
    team.displayName = updatedStackTeam.display_name;
    await this.teamRepository.save(team);

    return {
      id: team.id,
      stackId: team.stackId,
      displayName: updatedStackTeam.display_name,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  async delete(teamId: string) {
    const team = await this.teamRepository.findOne({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    await this.stackAuthService.deleteTeam(team.stackId);
    await this.teamRepository.softDelete({
      id: teamId,
    });
    await this.teamRoleRepository.softDelete({
      team: {
        id: teamId,
      },
    });
    await this.integrationPlatformRepository.softDelete({
      team: {
        id: teamId,
      },
    });
    await this.teamGettingStartedTaskRepository.softDelete({
      team: {
        id: teamId,
      },
    });

    const assistants = await this.aiAssistantRepository.find({
      where: {
        teamOwner: {
          id: teamId,
        },
      },
    });
    const assistantIds = assistants.map((assistant) => assistant.id);

    if (assistantIds.length) {
      await this.aiAssistantRepository.softDelete({
        id: In(assistantIds),
      });

      // TODO: Delete corresponding Jarvis bot
    }

    return {
      success: true,
    };
  }

  async getTeams(userId: string) {
    const teamRoles = await this.teamRoleRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['team.roles'],
    });

    const teams = teamRoles.map((teamRole) => ({
      team: {
        id: teamRole.team.id,
        displayName: teamRole.team.displayName,
        createdAt: teamRole.team.createdAt,
        updatedAt: teamRole.team.updatedAt,
      },
      role: teamRole.role,
      totalMembers: teamRole.team.roles.length,
    }));

    return teams;
  }

  async getTeamMembers(userId: string, teamId: string, { limit, offset }: { limit: number; offset: number }) {
    const team = await this.teamRepository.findOne({
      where: {
        id: teamId,
        roles: {
          user: {
            id: userId,
          },
          role: TeamRoleEnum.ADMIN,
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const res = await PaginationHelpers.paginate(
      this.teamRoleRepository,
      {
        where: {
          team: {
            id: teamId,
          },
        },
        order: {
          role: 'ASC',
          createdAt: 'ASC',
        },
        relations: ['user', 'team'],
      },
      limit,
      offset
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.items = res.items.map((teamRole) => ({
      userId: teamRole.user.id,
      teamId: teamRole.team.id,
      role: teamRole.role,
      createdAt: teamRole.createdAt,
      updatedAt: teamRole.updatedAt,
    }));

    return res;
  }

  async getTeamRoles(userId: string, teamId: string) {
    const teamRoles = await this.teamRoleRepository.find({
      where: {
        team: {
          id: teamId,
        },
        user: {
          id: userId,
        },
      },
    });

    if (!teamRoles.length) {
      return [];
    }

    return teamRoles.map((teamRole) => teamRole.role);
  }

  async sendEmailInviteMember(teamId: string, userId: string, email: string) {
    const stackAuthTeam = await this.teamRepository.findOne({
      where: {
        id: teamId,
      },
    });

    if (!stackAuthTeam) {
      throw new PreconditionFailedException('Cannot find team');
    }

    const teamRoles = await this.teamRoleRepository.findOne({
      where: {
        team: {
          id: teamId,
        },
        user: {
          id: userId,
        },
      },
      relations: ['team', 'user'],
    });
    if (!teamRoles || teamRoles.role !== TeamRoleEnum.ADMIN) {
      throw new PreconditionFailedException("Don't have permission to do this action!");
    }

    const res = await this.stackAuthService.sendEmailToInviteMember(stackAuthTeam.stackId, email);
    return res;
  }

  async acceptInvitation(userId: string, code: string) {
    const details = await this.stackAuthService.getTeamInvitationDetails(code);
    const res = await this.stackAuthService.acceptInvitation(code);
    if (res === HttpStatus.OK) {
      const team = await this.teamRepository.findOne({
        where: {
          stackId: details.team_id,
        },
        relations: ['roles'],
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      const teamRoles = await this.teamRoleRepository.findOne({
        where: {
          team: {
            id: team.id,
          },
          user: {
            id: userId,
          },
        },
      });
      if (!teamRoles) {
        await this.assistantService.createAssistantConfig(team.activateAssistantId, userId);

        const memberTeamRole = this.teamRoleRepository.create({
          role: TeamRoleEnum.MEMBER,
          user: {
            id: userId,
          },
        });
        team.roles.push(memberTeamRole);
        const res = await this.teamRepository.save(team);
        return res;
      } else {
        throw new PreconditionFailedException('Existed Member');
      }
    }
  }

  async getTeamMembersProfile(userId: string, teamId: string, { limit, offset }: { limit: number; offset: number }) {
    const teamRole = await this.teamRoleRepository.findOne({
      where: {
        team: {
          id: teamId,
        },
        user: {
          id: userId,
        },
      },
      relations: ['user', 'team'],
    });

    if (!teamRole) {
      throw new NotFoundException('Membership not found');
    }

    const teamMembers = await PaginationHelpers.paginate(
      this.teamRoleRepository,
      {
        where: {
          team: {
            id: teamId,
          },
        },
        relations: ['user', 'team'],
      },
      limit,
      offset
    );

    const membersProfile = await Promise.all(
      teamMembers.items.map(async (member) => {
        const profile = await this.stackAuthService.getTeamMemberProfile(member.team.stackId, member.user.stackId);
        return {
          ...member,
          display_name: profile.display_name,
          profile_image_url: profile.profile_image_url,
        };
      })
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    teamMembers.items = membersProfile.map((item) => ({
      userId: item.user.id,
      teamId: item.team.id,
      role: item.role,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      display_name: item.display_name,
      profile_image_url: item.profile_image_url,
      email: item.user.email,
    }));

    return {
      ...teamMembers,
      role: teamRole.role,
      current_user_id: teamRole.user.id,
    };
  }

  async removeTeamMember(teamId: string, memberId: string, userId: string) {
    const teamRoles = await this.teamRoleRepository.findOne({
      where: {
        team: {
          id: teamId,
        },
        user: {
          id: userId,
        },
      },
      relations: ['team', 'user'],
    });
    if (!teamRoles || teamRoles.role !== TeamRoleEnum.ADMIN) {
      throw new PreconditionFailedException("You don't have permission to do this action");
    }

    const toBeDeletedRole = await this.teamRoleRepository.findOne({
      where: {
        team: {
          id: teamId,
        },
        user: {
          id: memberId,
        },
      },
      relations: ['team', 'user'],
    });

    if (!toBeDeletedRole || toBeDeletedRole.role === TeamRoleEnum.ADMIN) {
      throw new PreconditionFailedException('You cannot to do this action');
    }

    const res = await this.stackAuthService.removeTeamMember(
      toBeDeletedRole.team.stackId,
      toBeDeletedRole.user.stackId
    );

    await this.teamRoleRepository.softDelete({
      id: toBeDeletedRole.id,
    });
    return res;
  }

  async addUserToTeam(userId: string, teamId: string, role: TeamRoleEnum) {
    const team = await this.teamRepository.findOne({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const teamRole = this.teamRoleRepository.create({
      user: {
        id: userId,
      },
      team: {
        id: teamId,
      },
      role: role,
    });

    return await this.teamRoleRepository.save(teamRole);
  }
}
