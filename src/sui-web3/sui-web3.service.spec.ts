import { Test, TestingModule } from '@nestjs/testing';
import { SuiWeb3Service } from './sui-web3.service';

describe('SuiWeb3Service', () => {
  let service: SuiWeb3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuiWeb3Service],
    }).compile();

    service = module.get<SuiWeb3Service>(SuiWeb3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
