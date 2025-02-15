import { User } from 'src/modules/user/entities/user.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { TeamRoleEnum } from '../constants/team-role.enum';

import { Team } from './team.entity';

@Entity({ name: 'Team_Roles' })
@Unique(['user', 'team'])
export class TeamRole extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Team, (team) => team.roles, { onDelete: 'CASCADE' })
  team: Team;

  @Column({ type: 'enum', enum: TeamRoleEnum })
  role: TeamRoleEnum;
}
