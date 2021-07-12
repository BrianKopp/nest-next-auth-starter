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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordsController } from './module/user/controllers/passwords.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST', 'localhost'),
          port: configService.get<number>('DATABASE_PORT', 5432),
          username: configService.get('DATABASE_USER', 'postgres'),
          password: configService.get('DATABASE_PASSWORD', 'postgres'),
          database: configService.get('DATABASE_NAME', 'postgres'),
          synchronize: configService.get('ENVIRONMENT') === 'local',
          entities: [User, UserPasswordHistory, UserEmailVerification, UserPasswordReset],
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const fromName = configService.get('EMAIL_FROM_NAME', 'noreply');
        const fromEmail = configService.get('EMAIL_FROM_ADDRESS');
        return {
          defaults: {
            from: `"${fromName}" <${fromEmail}>`,
          },
          preview: false,
          transport: {
            host: configService.get('EMAIL_SMTP_HOST'),
            port: configService.get<number>('EMAIL_SMTP_PORT'),
            logger: true,
            debug: true,
            auth: {
              user: configService.get('EMAIL_SMTP_USER'),
              pass: configService.get('EMAIL_SMTP_PASSWORD'),
            },
          },
          template: {
            dir: join(process.cwd(), 'emails'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    UserModule,
    AuthModule,
    ViewsModule,
  ],
  controllers: [PasswordsController],
  providers: [],
})
export class AppModule {}
