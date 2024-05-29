import { Module } from '@nestjs/common';
import { SuiWeb3Service } from './sui-web3.service';
import { SuiWeb3Controller } from './sui-web3.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../entity/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [SuiWeb3Service],
  controllers: [SuiWeb3Controller],
})
export class SuiWeb3Module {}
