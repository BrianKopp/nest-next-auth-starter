import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      const user = await this.auth.validateUser(username, password);
      if (!user) {
        console.info('user login failed with local strategy', username);
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      console.error('error getting user', err);
      throw err;
    }
  }
}
