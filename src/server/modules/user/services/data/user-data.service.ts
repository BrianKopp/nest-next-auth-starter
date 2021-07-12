import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  User,
  UserEmail,
  UserPassword,
  UserPasswordResetRequest,
  UserPreviousPasswords,
} from 'src/server/entities';
import { Connection, Repository } from 'typeorm';
import { UserPasswordDataService } from './user-password-data.service';
import { UserPasswordResetDataService } from './user-password-reset-data.service';

@Injectable()
export class UserDataService {
  constructor(
    @Inject() private connection: Connection,
    @InjectRepository(User) private users: Repository<User>,
    @Inject() private passwords: UserPasswordDataService,
    @Inject() private passwordResets: UserPasswordResetDataService,
  ) {}

  async createNewUser(emailAddress: string, hashedPassword: string): Promise<User> {
    const user = new User();
    user.username = emailAddress;

    const userPassword = new UserPassword();
    user.password = userPassword;
    userPassword.hashedPassword = hashedPassword;

    const prevUserPassword = new UserPreviousPasswords();
    prevUserPassword.hashedPassword = hashedPassword;
    user.previousPasswords = [prevUserPassword];

    const userEmail = new UserEmail();
    userEmail.email = emailAddress;
    userEmail.verified = false;
    user.emails = [userEmail];

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(user);
      console.log('successfully created user', {
        user: {
          id: user.id,
          uuid: user.uuid,
          username: user.username,
        },
      });
      return user;
    } catch (err) {
      console.error('error creating user', { error: err });
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async consumePasswordResetRequest(resetId: string, hashedPw: string): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    const pwReset = await this.passwordResets.get(resetId);
    const { user } = pwReset;
    await queryRunner.startTransaction();
    try {
      await this.passwords.setUserPassword(user, hashedPw, 5, queryRunner);
      await queryRunner.manager.delete(UserPasswordResetRequest, {
        id: pwReset.id,
      });
    } catch (err) {
      console.error('error consuming password reset request', {
        userId: user.id,
        resetId,
        error: err,
      });
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async lookup(usernameOrEmail: string): Promise<User> {
    try {
      return await this.getByEmail(usernameOrEmail);
    } catch (err) {
      console.info('did not find user by email', { email: usernameOrEmail });
    }

    try {
      return await this.getByUsername(usernameOrEmail);
    } catch (err) {
      console.info('did not find user by username', { username: usernameOrEmail });
    }

    throw new NotFoundException('could not find user');
  }

  async getByUsername(username: string): Promise<User> {
    return await this.users
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOneOrFail();
  }

  async getByEmail(email: string): Promise<User> {
    return await this.users
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.emails', 'email')
      .where('email.email = :email', { email: email.toLowerCase() })
      .getOneOrFail();
  }

  async get(id: number | string): Promise<User> {
    const qb = this.users.createQueryBuilder('user');
    if (typeof id === 'number') {
      qb.where('user.id = :id', { id });
    } else if (typeof id === 'string') {
      qb.where('user.uuid = :id', { id });
    } else {
      throw new Error('user id must be string or number');
    }
    return await qb.getOneOrFail();
  }
}
