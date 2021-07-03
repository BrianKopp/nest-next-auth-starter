import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { SessionService } from './services/session.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, UserModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
