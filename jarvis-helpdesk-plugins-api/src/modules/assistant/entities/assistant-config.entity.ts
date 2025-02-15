import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Assistant_Configs' })
export class AssistantConfig extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  values: {
    toneOfAI: string;
    language: string;
    includeReference: boolean;
    autoResponse: boolean;
    enableTemplate: boolean;
  };
}
