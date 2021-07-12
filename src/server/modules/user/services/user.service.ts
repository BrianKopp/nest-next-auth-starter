import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDTO } from 'src/server/dtos';
import { User } from 'src/server/entities';
import { UserDataService } from './data/user-data.service';
import { PasswordService } from './password.service';
import { EventEmitter2 } from 'eventemitter2';
import { NewUserCreatedEvent, PasswordResetRequestedEvent } from '../events';
import { UserEmailVerificationsDataService } from './data/user-email-verifications-data.service';
import { UserEmailsDataService } from './data/user-emails-data.service';
import { UserPasswordResetDataService } from './data/user-password-reset-data.service';
import { UserPasswordDataService } from './data/user-password-data.service';

@Injectable()
export class UserService {
  constructor(
    private events: EventEmitter2,
    private passwordService: PasswordService,
    private users: UserDataService,
    private userEmails: UserEmailsDataService,
    private emailVerifs: UserEmailVerificationsDataService,
    private passwords: UserPasswordDataService,
    private pwResets: UserPasswordResetDataService,
  ) {}

  async registerUser(registerDto: RegisterDTO): Promise<User> {
    if (!this.passwordService.passwordMeetsCriteria(registerDto.password)) {
      console.info('password does not meet criteria');
      throw new BadRequestException('password does not meet criteria');
    }
    const hashedPassword = await this.passwordService.hashPassword(registerDto.password);
    const user = await this.users.createNewUser(registerDto.email, hashedPassword);
    this.events.emit(NewUserCreatedEvent.name, new NewUserCreatedEvent(user, user.username));
    return user;
  }

  async verifyUserPassword(username: string, password: string): Promise<number> {
    const user = await this.users.lookup(username);
    const userPassword = await this.passwords.getForUser(user.id);
    const doPasswordsMatch = await this.passwordService.doesPasswordMatch(
      password,
      userPassword.hashedPassword,
    );
    if (!doPasswordsMatch) {
      console.log('failed login for user', { userId: user.id });
      throw new UnauthorizedException();
    }
    return user.id;
  }

  async verifyUserEmail(verificationId: string, verificationCode: string) {
    const verif = await this.emailVerifs.get(verificationId);
    if (verificationCode !== verif.code) {
      console.info('user email verification code invalid', { verificationId });
      throw new BadRequestException('verification code does not match');
    }

    await this.userEmails.markVerified(verif.email.id);
    await this.emailVerifs.delete(verif.id);
    console.info('marked user email as verified', { verificationId, emailId: verif.email.id });
  }

  async createPasswordResetRequest(usernameOrEmail: string) {
    const user = await this.users.lookup(usernameOrEmail);
    const resetRequest = await this.pwResets.createPasswordReset(user);
    this.events.emit(
      PasswordResetRequestedEvent.name,
      new PasswordResetRequestedEvent(resetRequest),
    );
  }

  async consumePasswordResetRequest(
    resetId: string,
    verificationCode: string,
    newPassword: string,
  ) {
    if (!this.passwordService.passwordMeetsCriteria(newPassword)) {
      console.info('password does not meet criteria', { resetId });
      throw new BadRequestException('password does not meet criteria');
    }
    const reset = await this.pwResets.get(resetId);
    if (reset.code !== verificationCode) {
      console.info('verificaton code does not match', { resetId });
      throw new NotFoundException();
    }
    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.users.consumePasswordResetRequest(resetId, hashedPassword);
    console.info('updated user password', { userId: reset.user.id, resetId });
  }

  async cancelPasswordResetRequest(resetId: string) {
    await this.pwResets.delete(resetId);
  }
}
