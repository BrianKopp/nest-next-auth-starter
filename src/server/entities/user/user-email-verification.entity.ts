import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEmail } from './user-email.entity';

@Entity()
export class UserEmailVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEmail, (ue) => ue.verifications)
  email: UserEmail;

  @Column()
  code: string;

  @CreateDateColumn()
  createDate: Date;

  @Column()
  expiresDate: Date;

  @BeforeInsert()
  setExpirationDate() {
    const now = new Date();
    const oneWeekLater = new Date(now.setDate(7 + now.getDate()));
    this.expiresDate = oneWeekLater;
  }
}
