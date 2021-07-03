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

  async getUser(lookup: string): Promise<User> {
    if (!lookup || typeof lookup !== 'string') {
      console.error(
        'error getting user, invalid lookup',
        lookup,
        typeof lookup,
      );
      throw new Error('error looking up user by text');
    }

    const usernameLookup = () => this.getUserByCriteriaOrFail(lookup, null);
    const emailLookup = () => this.getUserByCriteriaOrFail(null, lookup);

    let attemptFunctions = [usernameLookup, emailLookup];
    // if it looks like an email, try that first
    if (lookup.includes('@')) {
      attemptFunctions = [emailLookup, usernameLookup];
    }

    for (const attemptFn of attemptFunctions) {
      try {
        return await attemptFn();
      } catch (err) {
        if (err instanceof EntityNotFoundError) {
          continue;
        }
        throw err;
      }
    }

    console.info('user not found', lookup);
    throw new Error('user not found');
  }

  private async getUserByCriteriaOrFail(
    username?: string,
    email?: string,
  ): Promise<User> {
    const qb = this.users.createQueryBuilder('user');

    if (username) {
      qb.where('user.username = :username', {
        username: username.toLowerCase(),
      });
    } else if (email) {
      qb.where('user.email = :email', { email: email.toLowerCase() });
    }

    return qb.getOneOrFail();
  }

  async getPasswordHistory(userId: number): Promise<UserPasswordHistory[]> {
    return await this.oldPasswords
      .createQueryBuilder('pass')
      .where('pass.userId = :userId', { userId })
      .orderBy('pass.createDate')
      .limit(5)
      .getMany();
  }

  async insertUser(user: User): Promise<User> {
    await this.users.insert(user);
    const newUser = await this.getUser(user.username);
    const { hashedPassword, ...rest } = newUser;
    console.log('created user in database', rest);
    return newUser;
  }
}
