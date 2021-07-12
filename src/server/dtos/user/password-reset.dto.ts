import { IsString } from 'class-validator';

export class PasswordResetDTO {
  @IsString()
  newPassword: string;

  @IsString()
  code: string;
}
