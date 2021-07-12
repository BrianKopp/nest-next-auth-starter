import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserPasswordResetRequest } from 'src/server/entities';
import { Repository } from 'typeorm';
import { VerificationCodeService } from '../verification-code.service';

@Injectable()
export class UserPasswordResetDataService {
  constructor(
    private codes: VerificationCodeService,
    @InjectRepository(UserPasswordResetRequest)
    private resets: Repository<UserPasswordResetRequest>,
  ) {}

  async createPasswordReset(user: User): Promise<UserPasswordResetRequest> {
    const reset = new UserPasswordResetRequest();
    reset.user = user;
    reset.code = await this.codes.createVerificationCode(6);
    await this.resets.save(reset);
    return reset;
  }

  async delete(resetId: string) {
    const reset = await this.get(resetId);
    await this.resets.delete({
      id: resetId,
    });
    console.info('deleted password reset request', { resetId, userId: reset.user.id });
  }

  async get(id: string): Promise<UserPasswordResetRequest> {
    return await this.resets
      .createQueryBuilder('reset')
      .innerJoinAndSelect('reset.user', 'user')
      .where('reset.id = :id', { id })
      .getOneOrFail();
  }
}
