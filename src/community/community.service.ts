// src/community/community.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from '../entity/community.entity';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { SuiWeb3Service } from '../sui-web3/sui-web3.service';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
    private readonly suiWeb3Service: SuiWeb3Service,
  ) {}

  async create(createCommunityDto: CreateCommunityDto): Promise<Community> {
    const count = await this.suiWeb3Service.getGamesTransactionCount(
      createCommunityDto.gameId,
      null,
      createCommunityDto.walletAddress,
    );
    createCommunityDto.transactionCount = count;
    const community = this.communityRepository.create(createCommunityDto);
    return this.communityRepository.save(community);
  }

  findAll(): Promise<Community[]> {
    return this.communityRepository.find();
  }

  findOne(id: number): Promise<Community> {
    return this.communityRepository.findOne({ where: { id } });
  }

  findByGameId(gameId: number): Promise<Community[]> {
    return this.communityRepository.find({ where: { gameId } });
  }
}
