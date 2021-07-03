import { Injectable } from '@nestjs/common';
import { User } from 'src/server/entities/user.entity';
import { UserDataService } from './user-data.service';

@Injectable()
export class UserService {
  constructor(private userData: UserDataService) {}

  async getUser(lookup: string): Promise<User> {
    return await this.userData.getUser(lookup);
  }

  async createUser(user: User): Promise<User> {
    const newUser = await this.userData.insertUser(user);

    // TODO do other things like send email verification

    return newUser;
  }
}
