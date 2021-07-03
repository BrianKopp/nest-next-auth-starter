import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserPasswordHistory } from './user-password-history.entity';

@Entity()
@Unique('username', ['username'])
@Unique('email', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @Column({ type: 'bit', default: false })
  emailVerified: boolean;

  @Column()
  hashedPassword: string;

  @ManyToOne(() => UserPasswordHistory, (ph) => ph.user)
  oldPasswords?: UserPasswordHistory[];

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;
}
