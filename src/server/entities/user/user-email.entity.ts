import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEmailVerification } from './user-email-verification.entity';
import { User } from './user.entity';

@Entity()
export class UserEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ generated: 'uuid' })
  uuid: string;

  @Column()
  email: string;

  @Column()
  verified: boolean;

  @OneToMany(() => UserEmailVerification, (uev) => uev.email)
  verifications: UserEmailVerification[];

  @ManyToOne(() => User, (u) => u.emails)
  user: User;
}
