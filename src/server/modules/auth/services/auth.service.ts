import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/server/entities/user.entity';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(private users: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    let user: User;
    try {
      user = await this.users.getUser(username);
    } catch (err) {
      return null;
    }

    const passwordMatches = await this.comparePassword(user.hashedPassword, password);
    if (!passwordMatches) {
      console.info('user password not match', user.id);
      return null;
    }
    return user.id;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(hashedPassword: string, compareToPassword: string): Promise<boolean> {
    return await bcrypt.compare(compareToPassword, hashedPassword);
  }

  doesPasswordMeetCriteria(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false;
    }

    const criteriaRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!password.match(criteriaRegex)) {
      return false;
    }

    return true;
  }
}
