import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Conversation extends BaseEntity {
  @Column({ primary: true, unique: true })
  id!: string;

  @Column({ nullable: true })
  lastMessage: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
