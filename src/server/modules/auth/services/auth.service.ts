import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/server/entities/user.entity';
import { PasswordResetDTO } from 'src/shared/auth/password-reset.dto';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(private users: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    let user: User;
    try {
      user = await this.users.getUser(username);
    } catch (err) {
      return null;
    }

    const passwordMatches = await this.comparePassword(user.hashedPassword, password);
    if (!passwordMatches) {
      console.info('user password not match', user.id);
      return null;
    }
    return user.id;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(hashedPassword: string, compareToPassword: string): Promise<boolean> {
    return await bcrypt.compare(compareToPassword, hashedPassword);
  }

  doesPasswordMeetCriteria(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false;
    }

    const criteriaRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!password.match(criteriaRegex)) {
      return false;
    }

    return true;
  }

  async resetUserPassword(pwReset: PasswordResetDTO) {
    const { userId, passwordResetId, newPassword } = pwReset;

    const reset = await this.users.getPasswordReset(passwordResetId);
    if (reset.user.uuid !== userId) {
      throw new NotFoundException();
    }

    if (!this.doesPasswordMeetCriteria(newPassword)) {
      console.info('new password does not meet criteria');
      throw new BadRequestException('password does not meet criteria');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    const prevHashedPasswords = await this.users.getPreviousPasswords(reset.user.id);
    for (const prev of prevHashedPasswords) {
      if (prev.hashedPassword === hashedPassword) {
        throw new BadRequestException('password cannot match last 5 previous passwords');
      }
    }

    await this.users.consumePasswordReset(reset.id, reset.user.id, hashedPassword);
  }
}
