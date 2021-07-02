import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(private users: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.users.findOne(email);
    if (user?.password === password) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }
}
