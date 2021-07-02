import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(private users: UserService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.users.findOne(email);
    if (!user) {
      console.error('could not find user', email);
      return null;
    }

    if (user.password !== pass) {
      console.error('invalid password');
      return null;
    }
    const { password, ...rest } = user;
    return rest;
  }
}
