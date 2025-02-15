import { Team } from 'src/modules/team/entities/team.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { GettingStartedTask } from './getting-started-task.entity';

@Entity({ name: 'Team_Getting_Started_Tasks' })
export class TeamGettingStartedTask extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, (team) => team.teamGettingStartedTasks)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @ManyToOne(() => GettingStartedTask, (gettingStartedTask) => gettingStartedTask.teamGettingStartedTasks)
  @JoinColumn({ name: 'gettingStartedTaskId' })
  gettingStartedTask: GettingStartedTask;
}
