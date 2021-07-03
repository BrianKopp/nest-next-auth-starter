import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPasswordHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.oldPasswords, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  hashedPassword: string;

  @CreateDateColumn()
  createDate: Date;
}
