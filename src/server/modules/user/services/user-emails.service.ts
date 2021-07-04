import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserEmailVerification, UserPasswordReset } from 'src/server/entities';

@Injectable()
export class UserEmailsService {
  constructor(private mailer: MailerService, private config: ConfigService) {}

  async sendWelcomeMessage(user: User): Promise<void> {
    const appName = this.config.get('APP_NAME');
    await this.mailer.sendMail({
      to: user.email,
      subject: `Welcome to ${appName}`,
      template: './welcome',
      context: {
        appName,
      },
    });
  }

  async sendEmailVerification(verification: UserEmailVerification): Promise<void> {
    const urlBase = this.config.get('URL_BASE');
    const verifyPath = this.config.get('EMAIL_VERIFY_PATH');
    const appName = this.config.get('APP_NAME');
    const verificationUrl = `${urlBase}${verifyPath}?u=${verification.user.uuid}&v=${verification.id}`;
    await this.mailer.sendMail({
      to: verification.user.email,
      subject: `Verify email for ${appName}`,
      template: './emailverification',
      context: {
        appName,
        verificationUrl,
      },
    });
  }

  async sendPasswordReset(reset: UserPasswordReset): Promise<void> {
    const urlBase = this.config.get('URL_BASE');
    const passwordResetPath = '/user/password-reset';
    const appName = this.config.get('APP_NAME');
    const resetUrl = `${urlBase}${passwordResetPath}?u=${reset.user.uuid}&r=${reset.id}`;
    const passwordResetCancelPath = '/user/password-reset-cancel';
    const resetCancelUrl = `${urlBase}${passwordResetCancelPath}?u=${reset.user.uuid}&r=${reset.id}`;
    await this.mailer.sendMail({
      to: reset.user.email,
      subject: `Reset password for ${appName}`,
      template: './passwordreset',
      context: {
        appName,
        username: reset.user.username,
        resetUrl,
        resetCancelUrl,
      },
    });
  }
}
