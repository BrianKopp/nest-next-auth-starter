import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NewUserCreatedEvent } from '../events';
import { UserEmailVerificationsDataService } from './data/user-email-verifications-data.service';
import { UserEmailsDataService } from './data/user-emails-data.service';
import { UserEmailsService } from './user-emails.service';

@Injectable()
export class EventsService {
  constructor(
    private emails: UserEmailsService,
    private userEmails: UserEmailsDataService,
    private emailVerifications: UserEmailVerificationsDataService,
  ) {}

  @OnEvent(NewUserCreatedEvent.name)
  async sendWelcomeMessage(event: NewUserCreatedEvent) {
    await this.emails.sendWelcomeMessage(event.email);
  }

  @OnEvent(NewUserCreatedEvent.name)
  async createEmailVerification(event: NewUserCreatedEvent) {
    const userEmails = await this.userEmails.getEmailsForUser(event.user.id);
    for (const userEmail of userEmails) {
      const emailVerification = await this.emailVerifications.createEmailVerification(userEmail);
      await this.emails.sendEmailVerification(emailVerification);
    }
  }

  // TODO handle password reset requested event
}
