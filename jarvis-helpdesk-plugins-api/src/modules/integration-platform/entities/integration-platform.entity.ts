import { Team } from 'src/modules/team/entities/team.entity';
import { AuditableTable } from 'src/shared/entities/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PlatformTypeEnum } from '../constants/platform-type';

@Entity({ name: 'Integration_Platforms' })
export class IntegrationPlatform extends AuditableTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PlatformTypeEnum })
  type: PlatformTypeEnum;

  @Column({ type: 'text' })
  domain: string;

  @Column({ type: 'boolean', nullable: false })
  isEnable: boolean;

  @ManyToOne(() => Team, (team) => team.integrationPlatforms, { onDelete: 'CASCADE' })
  @JoinColumn()
  team: Team;
}
