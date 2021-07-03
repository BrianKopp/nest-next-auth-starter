import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserEmailVerification } from './user-email-verification.entity';
import { UserPasswordHistory } from './user-password-history.entity';
import { UserPasswordReset } from './user-password-reset.entity';

@Entity()
@Unique('username', ['username'])
@Unique('email', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ generated: 'uuid' })
  uuid: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @Column({ default: false })
  emailVerified: boolean;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @OneToMany(() => UserPasswordHistory, (ph) => ph.user)
  oldPasswords?: UserPasswordHistory[];

  @OneToMany(() => UserEmailVerification, (uev) => uev.user)
  emailVerifications?: UserEmailVerification[];

  @OneToMany(() => UserPasswordReset, (pr) => pr.user)
  passwordResets?: UserPasswordReset[];
}
