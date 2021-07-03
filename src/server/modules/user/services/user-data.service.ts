import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPasswordHistory } from 'src/server/entities/user-password-history.entity';
import { User } from 'src/server/entities/user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(UserPasswordHistory)
    private oldPasswords: Repository<UserPasswordHistory>,
  ) {}

  async getUser(criteria: {
    username?: string;
    email?: string;
  }): Promise<User> {
    if (!criteria || (!criteria.username && !criteria.email)) {
      console.error('error getting user, no criteria', criteria);
      throw new Error('cannot look up user with empty criteria');
    }
    const { username, email } = criteria;

    const qb = this.users.createQueryBuilder('user');
    if (criteria.username) {
      qb.where('user.username = :username', {
        username: username.toLowerCase(),
      });
    } else if (criteria.email) {
      qb.where('user.email = :email', { email: email.toLowerCase() });
    }

    try {
      return await qb.getOneOrFail();
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        console.info('lookup for user failed', criteria);
      }
      throw err;
    }
  }

  async getPasswordHistory(userId: number): Promise<UserPasswordHistory[]> {
    return await this.oldPasswords
      .createQueryBuilder('pass')
      .where('pass.userId = :userId', { userId })
      .orderBy('pass.createDate')
      .limit(5)
      .getMany();
  }
}
