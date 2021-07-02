import { Injectable } from '@nestjs/common';

export interface User {
  userId: number;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      userId: 1,
      email: 'john',
      password: 'foo',
    },
    {
      userId: 2,
      email: 'jane',
      password: 'bar',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
