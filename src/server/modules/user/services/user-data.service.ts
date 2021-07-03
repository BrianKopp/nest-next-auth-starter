import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEmailVerification } from 'src/server/entities/user-email-verification.entity';
import { UserPasswordHistory } from 'src/server/entities/user-password-history.entity';
import { UserPasswordReset } from 'src/server/entities/user-password-reset.entity';
import { User } from 'src/server/entities/user.entity';
import { Connection, EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class UserDataService {
  constructor(
    private rawConnection: Connection,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(UserPasswordHistory)
    private oldPasswords: Repository<UserPasswordHistory>,
    @InjectRepository(UserEmailVerification)
    private verifications: Repository<UserEmailVerification>,
    @InjectRepository(UserPasswordReset)
    private passwordResets: Repository<UserPasswordReset>,
  ) {}

  async getUser(lookup: string): Promise<User> {
    if (!lookup || typeof lookup !== 'string') {
      console.error('error getting user, invalid lookup', lookup, typeof lookup);
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

  private async getUserByCriteriaOrFail(username?: string, email?: string): Promise<User> {
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
    const queryRunner = this.rawConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.insert(User, user);
      const prevPassword = new UserPasswordHistory();
      prevPassword.hashedPassword = user.hashedPassword;
      prevPassword.user = user;
      await queryRunner.manager.insert(UserPasswordHistory, prevPassword);
    } catch (err) {
      console.error('an error occurred inserting a user', err);
      throw err;
    } finally {
      await queryRunner.release();
    }

    const newUser = await this.getUser(user.username);
    const { hashedPassword, ...rest } = newUser;
    console.log('created user in database', rest);
    return newUser;
  }

  async createEmailVerification(user: User, expirationDate: Date): Promise<UserEmailVerification> {
    const verif = new UserEmailVerification();
    verif.user = user;
    verif.expiresDate = expirationDate;
    const result = await this.verifications.insert(verif);
    return await this.verifications
      .createQueryBuilder('v')
      .innerJoinAndSelect('v.user', 'user')
      .where('v.id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();
  }

  async getVerification(uuid: string, now: Date) {
    const qb = this.verifications.createQueryBuilder('v');
    qb.innerJoinAndSelect('v.user', 'u');
    qb.where('v.id = :id', { id: uuid });
    qb.andWhere('v.expirationDate > :now', { now });
    return await qb.getOneOrFail();
  }

  async markUserVerified(uuid: string) {
    const user = await this.getUserByUuid(uuid);
    user.emailVerified = true;
    await this.users.save(user);
    console.log('marked user as verified', user.id);
    await this.verifications.delete({
      user,
    });
    console.log('deleted user verifications for user', user.id);
  }

  async getUserByUuid(uuid: string) {
    return this.users.createQueryBuilder('u').where('u.uuid = :uuid', { uuid }).getOneOrFail();
  }

  async getUserById(id: number) {
    return this.users.createQueryBuilder('u').where('u.id = :id', { id }).getOneOrFail();
  }

  async getPasswordReset(id: string): Promise<UserPasswordReset> {
    return await this.passwordResets
      .createQueryBuilder('pr')
      .innerJoinAndSelect('pr.user', 'user')
      .where('pr.id = :id', { id })
      .getOneOrFail();
  }

  async createPasswordReset(user: User, expirationDate: Date) {
    const pr = new UserPasswordReset();
    pr.user = user;
    pr.expirationDate = expirationDate;
    const result = await this.passwordResets.insert(pr);
    return await this.getPasswordReset(result.identifiers[0].id);
  }

  async resetUserPassword(userId: number, resetId: string, newPasswordHash: string) {
    const user = await this.getUserById(userId);
    const pwReset = await this.passwordResets.findOneOrFail(resetId);

    const queryRunner = this.rawConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(UserPasswordReset, pwReset);
      user.hashedPassword = newPasswordHash;
      await queryRunner.manager.save(user);

      const prevPassword = new UserPasswordHistory();
      prevPassword.hashedPassword = user.hashedPassword;
      prevPassword.user = user;
      await queryRunner.manager.insert(UserPasswordHistory, prevPassword);
      console.log('updated user password', user.id);
    } catch (err) {
      console.error('an error occurred updating user password', err, user.id, resetId);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
