import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity implements IUser {
  @Column({ primary: true, unique: true })
  id!: string;

  @Column({ unique: true, name: 'user_name' })
  userName!: string;

  @Column()
  password!: string;

  @Column({ name: 'display_name' })
  displayName!: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ name: 'is_admin' })
  isAdmin!: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
