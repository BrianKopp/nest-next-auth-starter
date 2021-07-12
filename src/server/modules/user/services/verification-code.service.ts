import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationCodeService {
  private readonly verificationCodeChars = '0123456789';
  async createVerificationCode(length: number): Promise<string> {
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.verificationCodeChars.length);
      code += this.verificationCodeChars.charAt(randomIndex);
    }
    return Promise.resolve(code);
  }
}
