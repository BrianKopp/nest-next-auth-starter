import { Controller, HttpCode, Param, Post, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('api/v1/user/email-verifications')
export class EmailVerificationsController {
  constructor(private users: UserService) {}

  @Post(':id/verify')
  async verifyEmail(@Param('id') id: string, @Query('code') code: string) {
    await this.users.verifyUserEmail(id, code);
    return { message: 'email verified' };
  }
}
