import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPasswordHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.oldPasswords)
  user: User;

  @Column()
  hashedPassword: string;

  @CreateDateColumn()
  createDate: Date;
}
