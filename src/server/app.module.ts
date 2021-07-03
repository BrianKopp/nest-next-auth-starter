import { Module } from '@nestjs/common';
import { ViewsModule } from './modules/views/views.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserPasswordHistory } from './entities/user-password-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User, UserPasswordHistory],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ViewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
