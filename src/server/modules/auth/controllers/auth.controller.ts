import {
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
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RegisterDTO, PasswordResetDTO } from '../../../dtos';
import { UserService } from '../../user/services/user.service';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { LocalAuthGuard } from '../guards/local.guard';
import { AuthService } from '../services/auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private users: UserService,
    private config: ConfigService,
  ) {}

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

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request) {
    req.logOut();
    return { message: 'logged out' };
  }

  @Post('register')
  @HttpCode(200)
  async register(@Req() req: Request, @Body() registerDto: RegisterDTO) {
    const user = await this.authService.registerUser(registerDto);
    try {
      await new Promise<void>((resolve, reject) => {
        req.logIn(user.id, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    } catch (err) {
      console.error('error logging user in', user, err);
    }
  }

  @Get('verify')
  @Redirect()
  async verifyEmail(
    @Query('u', ParseUUIDPipe) userId: string,
    @Query('v', ParseUUIDPipe) verificationId: string,
  ) {
    await this.users.verifyEmail(userId, verificationId);
    const baseUrl = this.config.get('URL_BASE');
    const redirectPath = this.config.get('EMAIL_VERIFY_REDIRECT_PATH');
    return { url: `${baseUrl}${redirectPath}` };
  }

  @Post('password-reset')
  @HttpCode(200)
  async resetPassword(@Body() passwordResetDTO: PasswordResetDTO) {
    await this.authService.resetUserPassword(passwordResetDTO);
  }
}
