import { UserPasswordResetRequest } from 'src/server/entities';

export class PasswordResetRequestedEvent {
  constructor(public readonly pwResetRequest: UserPasswordResetRequest) {}
}
