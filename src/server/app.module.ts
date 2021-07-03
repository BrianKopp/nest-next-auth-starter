import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ViewsModule } from './modules/views/views.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { User } from './entities/user.entity';
import { UserPasswordHistory } from './entities/user-password-history.entity';
import { UserEmailVerification } from './entities/user-email-verification.entity';
import { UserPasswordReset } from './entities/user-password-reset.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User, UserPasswordHistory, UserEmailVerification, UserPasswordReset],
      synchronize: true,
    }),
    MailerModule.forRoot({
      defaults: {
        from: '"noreply" <noreply@example.com>',
      },
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      preview: true,
      template: {
        dir: join(__dirname, 'emails'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    AuthModule,
    ViewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
