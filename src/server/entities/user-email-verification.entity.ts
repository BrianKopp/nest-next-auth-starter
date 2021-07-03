import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserEmailVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => User, (user) => user.emailVerifications)
  user: User;

  @CreateDateColumn()
  createDate: Date;

  @Column()
  expiresDate: Date;
}
