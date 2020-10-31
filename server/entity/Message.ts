import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, BaseEntity, Index } from 'typeorm';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index()
  conversation: string;

  @Column()
  sendingUser!: string;

  @Column()
  content!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
