import { ResponseTemplate } from 'src/modules/response-template/entities/response-template.entity';
import { Rule } from 'src/modules/rule/entities/rule.entity';
import { Team } from 'src/modules/team/entities/team.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserAssistantConfig } from './user-assistant-config.entity';

@Entity({ name: 'AI_Assistants' })
export class AIAssistant extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, (team) => team.aiAssistants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  teamOwner: Team;

  @Column({ type: 'uuid', nullable: true })
  jarvisBotId: string;

  @OneToMany(() => UserAssistantConfig, (userAssistantConfig) => userAssistantConfig.aiAssistant, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userAssistantConfigs: UserAssistantConfig[];

  @OneToMany(() => ResponseTemplate, (template) => template.assistant, { cascade: true, onDelete: 'CASCADE' })
  responseTemplates: ResponseTemplate[];

  @OneToMany(() => Rule, (rule) => rule.aiAssistant, { cascade: true, onDelete: 'CASCADE' })
  rules: Rule[];
}
