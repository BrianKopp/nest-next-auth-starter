import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPreviousPasswords {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.previousPasswords)
  user: User;

  @Column()
  hashedPassword: string;

  @CreateDateColumn()
  createDate: Date;
}
