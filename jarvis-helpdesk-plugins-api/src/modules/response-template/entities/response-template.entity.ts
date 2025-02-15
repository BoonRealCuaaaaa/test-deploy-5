import { AIAssistant } from 'src/modules/assistant/entities/assistant.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Response_Templates' })
export class ResponseTemplate extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  template: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @ManyToOne(() => AIAssistant, (assistant) => assistant.responseTemplates, { onDelete: 'CASCADE' })
  @JoinColumn()
  assistant: AIAssistant;
}
