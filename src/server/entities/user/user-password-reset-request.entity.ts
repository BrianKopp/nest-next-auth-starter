import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPasswordResetRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.passwordResetRequests, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  code: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  expirationDate: Date;

  @BeforeInsert()
  private setExpirationDate() {
    const now = new Date();
    const oneHourLater = new Date(now.setHours(1 + now.getHours()));
    this.expirationDate = oneHourLater;
  }
}
