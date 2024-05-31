import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from '../entity/game.entity';
import { SuiWeb3Service } from '../sui-web3/sui-web3.service';
@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameService, SuiWeb3Service],
})
export class GameModule {}
