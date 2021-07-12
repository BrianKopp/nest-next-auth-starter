import { Test, TestingModule } from '@nestjs/testing';
import { PasswordsController } from './passwords.controller';

describe('PasswordsController', () => {
  let controller: PasswordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordsController],
    }).compile();

    controller = module.get<PasswordsController>(PasswordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
