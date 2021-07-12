import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserEmail } from './user-email.entity';
import { UserPasswordResetRequest } from './user-password-reset-request.entity';
import { UserPassword } from './user-password.entity';
import { UserPreviousPasswords } from './user-previous-passwords.entity';

@Entity()
@Unique('username', ['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ generated: 'uuid' })
  uuid: string;

  @Column()
  username: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @OneToMany(() => UserEmail, (ue) => ue.user)
  emails: UserEmail[];

  @OneToOne(() => UserPassword)
  password?: UserPassword;

  @OneToMany(() => UserPreviousPasswords, (upp) => upp.user)
  previousPasswords?: UserPreviousPasswords[];

  @OneToMany(() => UserPasswordResetRequest, (uprr) => uprr.user)
  passwordResetRequests?: UserPasswordResetRequest[];
}
