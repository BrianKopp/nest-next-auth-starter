import { Test, TestingModule } from '@nestjs/testing';
import { UserEmailVerificationsDataService } from './user-email-verifications-data.service';

describe('UserEmailVerificationsDataService', () => {
  let service: UserEmailVerificationsDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEmailVerificationsDataService],
    }).compile();

    service = module.get<UserEmailVerificationsDataService>(UserEmailVerificationsDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
