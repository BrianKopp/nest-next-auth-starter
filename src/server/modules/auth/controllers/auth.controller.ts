import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from '../guards/local.guard';

@Controller('api/v1/auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request) {
    return req.user;
  }
}
