import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserEmailVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.emailVerifications, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createDate: Date;

  @Column()
  expiresDate: Date;
}
