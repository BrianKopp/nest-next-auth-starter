import { Test, TestingModule } from '@nestjs/testing';
import { UserPasswordResetDataService } from './user-password-reset-data.service';

describe('UserPasswordResetDataService', () => {
  let service: UserPasswordResetDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPasswordResetDataService],
    }).compile();

    service = module.get<UserPasswordResetDataService>(UserPasswordResetDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
