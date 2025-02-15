import { AIAssistant } from 'src/modules/assistant/entities/assistant.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AssistantConfig } from './assistant-config.entity';

@Entity({ name: 'User_Assistant_Configs' })
export class UserAssistantConfig extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userAssistantConfigs)
  @JoinColumn()
  user: User;

  @ManyToOne(() => AIAssistant, (aiAssistant) => aiAssistant.userAssistantConfigs)
  @JoinColumn()
  aiAssistant: AIAssistant;

  @OneToOne(() => AssistantConfig)
  @JoinColumn()
  assistantConfig: AssistantConfig;

  @Column({ type: 'jsonb' })
  metadata: Record<string, unknown>;
}
