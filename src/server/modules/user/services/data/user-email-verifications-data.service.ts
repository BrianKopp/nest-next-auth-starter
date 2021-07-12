import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEmail, UserEmailVerification } from 'src/server/entities';
import { Repository } from 'typeorm';
import { VerificationCodeService } from '../verification-code.service';

@Injectable()
export class UserEmailVerificationsDataService {
  constructor(
    private codes: VerificationCodeService,
    @InjectRepository(UserEmailVerification)
    private verifications: Repository<UserEmailVerification>,
  ) {}

  async createEmailVerification(email: UserEmail): Promise<UserEmailVerification> {
    const verif = new UserEmailVerification();
    verif.email = email;
    verif.code = await this.codes.createVerificationCode(6);

    await this.verifications.save(verif);
    console.info('created email verification', {
      userEmailId: email.id,
      userEmail: email.email,
      verificationId: verif.id,
    });
    return verif;
  }

  async get(id: string): Promise<UserEmailVerification> {
    return await this.verifications
      .createQueryBuilder('verif')
      .innerJoinAndSelect('verif.email', 'email')
      .where('verif.id = :id', { id })
      .getOneOrFail();
  }

  async delete(id: string) {
    await this.verifications.delete({ id });
    console.info('deleted email verification', { id });
  }
}
