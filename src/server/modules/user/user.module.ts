import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { PasswordsController } from './controllers/passwords.controller';
import { EmailVerificationsController } from './controllers/email-verifications.controller';
import { UserController } from './controllers/user.controller';
import { EventsService } from './services/events.service';
import { PasswordService } from './services/password.service';
import { SessionService } from './services/session.service';
import { UserEmailsService } from './services/user-emails.service';
import { UserService } from './services/user.service';
import { VerificationCodeService } from './services/verification-code.service';
import { UserEmailsDataService } from './services/data/user-emails-data.service';
import { UserEmailVerificationsDataService } from './services/data/user-email-verifications-data.service';
import { UserDataService } from './services/data/user-data.service';
import { UserPasswordDataService } from './services/data/user-password-data.service';
import { UserPasswordResetDataService } from './services/data/user-password-reset-data.service';
import { LocalStrategy } from './strategies/local.strategy';
import {
  User,
  UserEmail,
  UserEmailVerification,
  UserPassword,
  UserPasswordResetRequest,
  UserPreviousPasswords,
} from 'src/server/entities';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: true }),
    MailerModule,
    TypeOrmModule.forFeature([
      User,
      UserEmailVerification,
      UserEmail,
      UserPassword,
      UserPasswordResetRequest,
      UserPreviousPasswords,
    ]),
  ],
  providers: [
    EventsService,
    PasswordService,
    SessionService,
    UserEmailsService,
    UserService,
    VerificationCodeService,
    UserEmailsDataService,
    UserDataService,
    UserPasswordDataService,
    UserEmailsDataService,
    UserEmailVerificationsDataService,
    UserPasswordResetDataService,
    LocalStrategy,
  ],
  exports: [UserService],
  controllers: [UserController, PasswordsController, EmailVerificationsController],
})
export class UserModule {}
