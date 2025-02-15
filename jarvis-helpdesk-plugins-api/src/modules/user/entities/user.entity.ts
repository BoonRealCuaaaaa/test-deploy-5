import { UserAssistantConfig } from 'src/modules/assistant/entities/user-assistant-config.entity';
import { TeamRole } from 'src/modules/team/entities/team-role.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Users' })
export class User extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  stackId: string;

  @OneToMany(() => TeamRole, (role) => role.user, { cascade: true })
  roles: TeamRole[];

  @OneToMany(() => UserAssistantConfig, (userAssistantConfig) => userAssistantConfig.user)
  @JoinColumn()
  userAssistantConfigs: UserAssistantConfig[];

  @Column({ type: 'text', nullable: true })
  email: string;
}
