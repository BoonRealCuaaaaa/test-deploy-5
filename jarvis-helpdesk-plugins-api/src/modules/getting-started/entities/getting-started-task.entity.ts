import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { GettingStartedTaskTypeEnum } from '../constants/getting-started-task-type';

import { TeamGettingStartedTask } from './team-getting-started-task.entity';

@Entity({ name: 'Getting_Started_Tasks' })
export class GettingStartedTask extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  link: string;

  @Column({ type: 'enum', enum: GettingStartedTaskTypeEnum })
  name: GettingStartedTaskTypeEnum;

  @OneToMany(() => TeamGettingStartedTask, (teamtGettingStartedTask) => teamtGettingStartedTask.gettingStartedTask)
  teamGettingStartedTasks: TeamGettingStartedTask[];
}
