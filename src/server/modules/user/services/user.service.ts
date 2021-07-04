import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPasswordReset } from 'src/server/entities/user-password-reset.entity';
import { User } from 'src/server/entities/user.entity';
import { UserDataService } from './user-data.service';
import { UserEmailsService } from './user-emails.service';

@Injectable()
export class UserService {
  constructor(private userData: UserDataService, private emails: UserEmailsService) {}

  async getUser(lookup: string): Promise<User> {
    return await this.userData.getUser(lookup);
  }

  async createUser(user: User): Promise<User> {
    const newUser = await this.userData.insertUser(user);

    const now = new Date();
    const expirationDate = new Date(now.setMonth(now.getMonth() + 1));
    const savedVerification = await this.userData.createEmailVerification(user, expirationDate);
    await this.emails.sendEmailVerification(savedVerification);

    return newUser;
  }

  async verifyEmail(userUuid: string, verificationUuid: string) {
    const verification = await this.userData.getVerification(verificationUuid, new Date());
    if (verification.user.uuid !== userUuid) {
      throw new NotFoundException('unexpected verification id');
    }
    await this.userData.markUserVerified(userUuid);
  }

  async createPasswordReset(username: string): Promise<UserPasswordReset> {
    const user = await this.userData.getUser(username);
    const now = new Date();
    const expirationDate = new Date(now.setMonth(now.getMonth() + 1));
    const reset = await this.userData.createPasswordReset(user, expirationDate);
    await this.emails.sendPasswordReset(reset);
    return reset;
  }

  async cancelPasswordReset(id: string) {
    return await this.userData.cancelPasswordReset(id);
  }

  async getPasswordReset(resetId: string): Promise<UserPasswordReset> {
    return await this.userData.getPasswordReset(resetId);
  }

  async getPreviousPasswords(userId: number) {
    return await this.userData.getPasswordHistory(userId);
  }

  async consumePasswordReset(resetId: string, userId: number, newPasswordHash: string) {
    await this.userData.resetUserPassword(userId, resetId, newPasswordHash);
  }
}
