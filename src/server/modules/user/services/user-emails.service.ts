import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEmailVerification } from 'src/server/entities/user-email-verification.entity';
import { UserPasswordReset } from 'src/server/entities/user-password-reset.entity';

@Injectable()
export class UserEmailsService {
  constructor(private mailer: MailerService, private config: ConfigService) {}

  async sendEmailVerification(verification: UserEmailVerification): Promise<void> {
    const urlBase = this.config.get('URL_BASE');
    const verifyPath = this.config.get('EMAIL_VERIFY_PATH');
    const appName = this.config.get('APP_NAME');
    const verificationUrl = `${urlBase}${verifyPath}?u=${verification.user.uuid}&v=${verification.id}`;
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

  async sendPasswordReset(reset: UserPasswordReset): Promise<void> {
    const urlBase = this.config.get('URL_BASE');
    const passwordResetPath = '/password-reset';
    const appName = this.config.get('APP_NAME');
    const resetUrl = `${urlBase}${passwordResetPath}?u=${reset.user.uuid}&v=${reset.id}`;
    await this.mailer.sendMail({
      to: reset.user.email,
      subject: `Reset password for ${appName}`,
      template: './passwordreset',
      context: {
        appName,
        username: reset.user.username,
        resetUrl,
      },
    });
  }
}
