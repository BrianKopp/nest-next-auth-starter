import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEmailVerification } from 'src/server/entities/user-email-verification.entity';

@Injectable()
export class UserEmailsService {
  constructor(private mailer: MailerService) {}

  async sendEmailVerification(verification: UserEmailVerification): Promise<void> {
    const verificationUrl = `https://example.com/api/auth/email-verification?u=${verification.user.uuid}&v=${verification.id}`;
    await this.mailer.sendMail({
      to: verification.user.email,
      subject: 'Welcome to Example Service!',
      template: 'welcome',
      context: {
        username: verification.user.username,
        verificationUrl,
      },
    });
  }
}
