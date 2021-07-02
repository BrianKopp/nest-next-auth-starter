import { Module } from '@nestjs/common';
import { ViewsModule } from './modules/views/views.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, ViewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
