import { User } from 'src/server/entities';

export class NewUserCreatedEvent {
  constructor(public readonly user: User, public readonly email: string) {}
}
