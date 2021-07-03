import { IsString } from 'class-validator';

export class PasswordResetDTO {
  @IsString()
  userId: string;

  @IsString()
  passwordResetId: string;

  @IsString()
  newPassword: string;
}
