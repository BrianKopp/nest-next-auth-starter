import { Test, TestingModule } from '@nestjs/testing';
import { UserEmailsDataService } from './user-emails-data.service';

describe('UserEmailsDataService', () => {
  let service: UserEmailsDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEmailsDataService],
    }).compile();

    service = module.get<UserEmailsDataService>(UserEmailsDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
