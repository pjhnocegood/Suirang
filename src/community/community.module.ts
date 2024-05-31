// src/community/community.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityService } from './community.service';
import { Community } from '../entity/community.entity';
import { CommunityController } from './community.controller';
import { SuiWeb3Service } from '../sui-web3/sui-web3.service';
import { Repository } from 'typeorm';
import { Game } from '../entity/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Community, Game])],
  providers: [CommunityService, SuiWeb3Service],
  controllers: [CommunityController],
})
export class CommunityModule {}
