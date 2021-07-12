import { Test, TestingModule } from '@nestjs/testing';
import { VerificationCodeService } from './verification-code.service';

describe('VerificationCodeService', () => {
  let service: VerificationCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerificationCodeService],
    }).compile();

    service = module.get<VerificationCodeService>(VerificationCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
