import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { RegisterDTO } from 'src/server/dtos';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { LocalAuthGuard } from '../guards/local.guard';
import { UserService } from '../services/user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private users: UserService) {}

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
  async registerUser(@Req() req: Request, @Body() registerDto: RegisterDTO) {
    const user = await this.users.registerUser(registerDto);
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
      console.error('error logging user in', { userId: user.id, error: err });
    }
  }
}
