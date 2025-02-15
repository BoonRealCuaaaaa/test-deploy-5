import { AIAssistant } from 'src/modules/assistant/entities/assistant.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Rules' })
export class Rule extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  isEnable: boolean;

  @ManyToOne(() => AIAssistant, (aiAssistant) => aiAssistant.rules)
  @JoinColumn()
  aiAssistant: AIAssistant;
}
