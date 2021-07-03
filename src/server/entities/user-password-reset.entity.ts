import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => User, (user) => user.passwordResets)
  user: User;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  expirationDate: Date;
}
