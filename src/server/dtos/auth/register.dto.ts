import { IsEmail, IsString } from 'class-validator';

export class RegisterDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
