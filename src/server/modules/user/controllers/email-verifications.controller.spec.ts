import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationsController } from './email-verifications.controller';

describe('EmailVerificationsController', () => {
  let controller: EmailVerificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailVerificationsController],
    }).compile();

    controller = module.get<EmailVerificationsController>(EmailVerificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
