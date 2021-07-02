import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionService extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    // trivially serialize the thing
    done(null, JSON.stringify(user));
  }

  deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ): any {
    // trivially deserialize the user
    done(null, JSON.parse(payload));
  }
}
