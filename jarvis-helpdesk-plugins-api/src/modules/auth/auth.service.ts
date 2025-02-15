import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TeamRole } from '../team/entities/team-role.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(TeamRole) private teamRoleRepository: Repository<TeamRole>) {}

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
}
