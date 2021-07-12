import { Body, Controller, Param, Post } from '@nestjs/common';
import { PasswordResetDTO, PasswordResetRequestDTO } from 'src/server/dtos';
import { UserService } from '../services/user.service';

@Controller('api/v1/user/passwords')
export class PasswordsController {
  constructor(private users: UserService) {}

  @Post('reset-request')
  async createPasswordRequest(@Body() passwordResetRequestDTO: PasswordResetRequestDTO) {
    await this.users.createPasswordResetRequest(passwordResetRequestDTO.username);
    return { message: 'password reset request sent' };
  }

  @Post('reset-request/:resetId')
  async consumePasswordResetRequest(
    @Param('resetId') resetId: string,
    @Body() passwordResetDTO: PasswordResetDTO,
  ) {
    await this.users.consumePasswordResetRequest(
      resetId,
      passwordResetDTO.code,
      passwordResetDTO.newPassword,
    );
  }

  @Post('reset-request/:resetId/cancel')
  async cancelPasswordResetRequest(@Param('resetId') resetId: string) {
    await this.users.cancelPasswordResetRequest(resetId);
    return { message: 'reset request cancelled' };
  }
}
