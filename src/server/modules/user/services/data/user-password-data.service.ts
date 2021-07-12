import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserPassword, UserPreviousPasswords } from 'src/server/entities';
import { Connection, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class UserPasswordDataService {
  constructor(
    @Inject() private connection: Connection,
    @InjectRepository(UserPassword) private passwords: Repository<UserPassword>,
  ) {}

  async getForUser(userId: number): Promise<UserPassword> {
    return await this.passwords
      .createQueryBuilder('pw')
      .innerJoinAndSelect('pw.user', 'user')
      .where('user.id = :userId', { userId })
      .getOneOrFail();
  }
  async setUserPassword(
    user: User,
    hashedPw: string,
    forbidPrevPasswordCt?: number,
    withQueryRunner?: QueryRunner,
  ) {
    let queryRunner = withQueryRunner;
    let isMyTransaction = false;
    if (!queryRunner) {
      queryRunner = this.connection.createQueryRunner();
      await queryRunner.startTransaction();
      isMyTransaction = true;
    }

    try {
      if (forbidPrevPasswordCt) {
        const prevPasswordRepo = queryRunner.manager.getRepository(UserPreviousPasswords);
        const prevPasswords = await prevPasswordRepo
          .createQueryBuilder('pp')
          .innerJoin('pp.user', 'user')
          .where('user.id = :id', { id: user.id })
          .limit(forbidPrevPasswordCt)
          .getMany();
        for (const pp of prevPasswords) {
          if (pp.hashedPassword === hashedPw) {
            console.info('update password failed, was same as one of previous passwords', {
              userId: user.id,
            });
            throw new Error(`password cannot be one of previous ${forbidPrevPasswordCt} passwords`);
          }
        }
      }

      const userPassword = await queryRunner.manager
        .getRepository(UserPassword)
        .createQueryBuilder('up')
        .innerJoin('up.user', 'user')
        .where('user.id = :id', { id: user.id })
        .getOneOrFail();
      await queryRunner.manager.update(
        UserPassword,
        {
          id: userPassword.id,
        },
        {
          hashedPassword: hashedPw,
        },
      );

      const prevPassword = new UserPreviousPasswords();
      prevPassword.user = user;
      prevPassword.hashedPassword = hashedPw;
      await queryRunner.manager.save(prevPassword);
      console.info('updated user password', { userId: user.id });
      return;
    } catch (err) {
      console.error('error updating user password', { userId: user.id, error: err });
      throw err;
    } finally {
      if (isMyTransaction) {
        await queryRunner.release();
      }
    }
  }
}
