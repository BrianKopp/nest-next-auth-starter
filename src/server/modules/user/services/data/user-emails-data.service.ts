import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEmail } from 'src/server/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserEmailsDataService {
  constructor(@InjectRepository(UserEmail) private userEmails: Repository<UserEmail>) {}

  async getEmailsForUser(userId: number) {
    return await this.userEmails
      .createQueryBuilder('email')
      .innerJoin('email.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async markVerified(emailId: number) {
    const email = await this.get(emailId);
    email.verified = true;
    await this.userEmails.save(email);
  }

  async get(id: number) {
    return await this.userEmails
      .createQueryBuilder('email')
      .where('email.id = :id', { id })
      .getOneOrFail();
  }
}
