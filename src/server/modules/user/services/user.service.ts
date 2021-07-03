import { Injectable } from '@nestjs/common';
import { User } from 'src/server/entities/user.entity';
import { UserDataService } from './user-data.service';
import { UserEmailsService } from './user-emails.service';

@Injectable()
export class UserService {
  constructor(
    private userData: UserDataService,
    private emails: UserEmailsService,
  ) {}

  async getUser(lookup: string): Promise<User> {
    return await this.userData.getUser(lookup);
  }

  async createUser(user: User): Promise<User> {
    const newUser = await this.userData.insertUser(user);

    const now = new Date();
    const expirationDate = new Date(now.setMonth(now.getMonth() + 1));
    const savedVerification = await this.userData.createEmailVerification(
      user,
      expirationDate,
    );
    await this.emails.sendEmailVerification(savedVerification);

    return newUser;
  }
}
