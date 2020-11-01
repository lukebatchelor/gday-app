import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, BaseEntity, Index } from 'typeorm';

@Entity()
@Index(['user', 'conversation'], { unique: true })
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index()
  user!: string;

  @Column()
  @Index()
  conversation!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
