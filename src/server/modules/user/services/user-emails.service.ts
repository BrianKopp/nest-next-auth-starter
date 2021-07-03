import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEmailVerification } from 'src/server/entities/user-email-verification.entity';

@Injectable()
export class UserEmailsService {
  constructor(private mailer: MailerService, private config: ConfigService) {}

  async sendEmailVerification(verification: UserEmailVerification): Promise<void> {
    const urlBase = this.config.get('URL_BASE');
    const appName = this.config.get('APP_NAME');
    const verificationUrl = `${urlBase}/api/auth/email-verification?u=${verification.user.uuid}&v=${verification.id}`;
    await this.mailer.sendMail({
      to: verification.user.email,
      subject: `Welcome to ${appName}`,
      template: './welcome',
      context: {
        appName,
        username: verification.user.username,
        verificationUrl,
      },
    });
  }
}
