import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.passwordResets, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  expirationDate: Date;
}
