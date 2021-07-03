import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  ParseUUIDPipe,
  Post,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/server/entities/user.entity';
import { PasswordResetDTO } from 'src/shared/auth/password-reset.dto';
import { RegisterDTO } from 'src/shared/auth/register.dto';
import { UserService } from '../../user/services/user.service';
import { LocalAuthGuard } from '../guards/local.guard';
import { AuthService } from '../services/auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService, private users: UserService) {}

  @Get()
  async health() {
    return { message: 'ok' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request) {
    return req.user;
  }

  @Post('register')
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDTO) {
    if (!this.authService.doesPasswordMeetCriteria(registerDto.password)) {
      console.info('password does not meet criteria');
      throw new BadRequestException('password does not meet criteria');
    }

    const user = new User();
    user.email = registerDto.email;
    user.username = registerDto.username;
    user.firstName = registerDto.firstName;
    user.lastName = registerDto.lastName;
    user.hashedPassword = await this.authService.hashPassword(registerDto.password);
  }

  @Get('verify')
  @Redirect('https://example.com/') // or whatever home is
  async verifyEmail(
    @Query('u', ParseUUIDPipe) userId: string,
    @Query('v', ParseUUIDPipe) verificationId: string,
  ) {
    await this.users.verifyEmail(userId, verificationId);
  }

  @Post('password-reset')
  @HttpCode(200)
  async resetPassword(@Body() passwordResetDTO: PasswordResetDTO) {
    await this.authService.resetUserPassword(passwordResetDTO);
  }
}
