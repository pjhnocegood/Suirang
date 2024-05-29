import { Test, TestingModule } from '@nestjs/testing';
import { SuiWeb3Controller } from './sui-web3.controller';

describe('SuiWeb3Controller', () => {
  let controller: SuiWeb3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuiWeb3Controller],
    }).compile();

    controller = module.get<SuiWeb3Controller>(SuiWeb3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
