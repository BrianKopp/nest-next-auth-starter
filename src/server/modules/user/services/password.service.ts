import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordRequirementRegexes, PasswordRequirements } from 'src/shared';
import { PasswordNotMeetCriteriaError } from '../errors/password-not-meet-criteria.error';

@Injectable()
export class PasswordService {
  passwordMeetsCriteria(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false;
    }

    const validationErrors: PasswordRequirements[] = [];
    for (const key in PasswordRequirementRegexes) {
      if (!password.match(PasswordRequirementRegexes[key])) {
        validationErrors.push(key as PasswordRequirements);
      }
    }
    if (validationErrors.length) {
      throw new PasswordNotMeetCriteriaError(validationErrors);
    }

    return true;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
