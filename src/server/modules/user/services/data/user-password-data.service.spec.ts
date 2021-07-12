import { Test, TestingModule } from '@nestjs/testing';
import { UserPasswordDataService } from './user-password-data.service';

describe('UserPasswordDataService', () => {
  let service: UserPasswordDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPasswordDataService],
    }).compile();

    service = module.get<UserPasswordDataService>(UserPasswordDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
