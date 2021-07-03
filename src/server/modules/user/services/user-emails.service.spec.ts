import { Test, TestingModule } from '@nestjs/testing';
import { UserEmailsService } from './user-emails.service';

describe('UserEmailsService', () => {
  let service: UserEmailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEmailsService],
    }).compile();

    service = module.get<UserEmailsService>(UserEmailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
