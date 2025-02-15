import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AuditableTable extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;
}
