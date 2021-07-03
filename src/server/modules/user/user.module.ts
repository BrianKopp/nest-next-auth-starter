import { Module } from '@nestjs/common';
import { UserDataService } from './services/user-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/server/entities/user.entity';
import { UserPasswordHistory } from 'src/server/entities/user-password-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPasswordHistory])],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class UserModule {}
