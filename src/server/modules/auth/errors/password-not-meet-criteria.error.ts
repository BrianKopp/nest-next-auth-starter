import { BadRequestException } from '@nestjs/common';
import { PasswordRequirements } from 'src/shared';

export class PasswordNotMeetCriteriaError extends BadRequestException {
  constructor(violations: PasswordRequirements[]) {
    const message = `password did not match criteria: ${violations.join(',')}`;
    super(message);
  }
}
