import { AIAssistant } from 'src/modules/assistant/entities/assistant.entity';
import { TeamGettingStartedTask } from 'src/modules/getting-started/entities/team-getting-started-task.entity';
import { IntegrationPlatform } from 'src/modules/integration-platform/entities/integration-platform.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

import { TeamRole } from './team-role.entity';

@Entity({ name: 'Teams' })
export class Team extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  stackId: string;

  @Column({ type: 'text' })
  displayName: string;

  @Column({ type: 'uuid', nullable: true })
  activateAssistantId: string;

  @OneToMany(() => AIAssistant, (aiAssistant) => aiAssistant.teamOwner, { cascade: true, onDelete: 'CASCADE' })
  aiAssistants: Relation<AIAssistant>[];

  @OneToMany(() => TeamRole, (role) => role.team, { cascade: true })
  roles: TeamRole[];

  @OneToMany(() => IntegrationPlatform, (platform) => platform.team, { cascade: true, onDelete: 'CASCADE' })
  integrationPlatforms: IntegrationPlatform[];

  @OneToMany(() => TeamGettingStartedTask, (teamGettingStartedTask) => teamGettingStartedTask.team, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  teamGettingStartedTasks: TeamGettingStartedTask[];
}
