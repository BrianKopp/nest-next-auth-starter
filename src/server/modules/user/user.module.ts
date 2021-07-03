import { Module } from '@nestjs/common';
import { UserDataService } from './services/user-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/server/entities/user.entity';
import { UserPasswordHistory } from 'src/server/entities/user-password-history.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPasswordHistory])],
  providers: [UserDataService, UserService],
  exports: [UserService],
})
export class UserModule {}
