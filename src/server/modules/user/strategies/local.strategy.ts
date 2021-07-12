import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../services/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private users: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<number> {
    try {
      return await this.users.verifyUserPassword(username, password);
    } catch (err) {
      console.error('error verifying user password', { username, error: err });
      throw new UnauthorizedException();
    }
  }
}
