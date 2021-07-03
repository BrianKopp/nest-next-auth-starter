import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/server/entities/user.entity';
import { RegisterDTO } from 'src/shared/auth/register.dto';
import { UserService } from '../../user/services/user.service';
import { LocalAuthGuard } from '../guards/local.guard';
import { AuthService } from '../services/auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService, private users: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request) {
    return req.user;
  }

  @Post('register')
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDTO) {
    const passwordMeetsCriteria =
      await this.authService.doesPasswordMeetCriteria(registerDto.password);
    if (!passwordMeetsCriteria) {
      console.info('password does not meet criteria');
      throw new BadRequestException('password does not meet criteria');
    }

    const user = new User();
    user.email = registerDto.email;
    user.username = registerDto.username;
    user.firstName = registerDto.firstName;
    user.lastName = registerDto.lastName;
    user.hashedPassword = await this.authService.hashPassword(
      registerDto.password,
    );
  }
}
