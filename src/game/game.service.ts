import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameDto } from '../dto/game.dto';
import { Game } from '../entity/game.entity';
import { UpdateGameDto } from '../dto/update-game.dto';
import { SuiWeb3Service } from '../sui-web3/sui-web3.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly suiWeb3Service: SuiWeb3Service,
  ) {}

  async create(gameDto: GameDto): Promise<Game> {
    const game = this.gameRepository.create(gameDto);
    return this.gameRepository.save(game);
  }

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  async findAllGamesWithRanking(startDate: string): Promise<any[]> {
    const games = await this.gameRepository.find();
    const rankings = await this.calculateRankings(games, startDate);
    return rankings;
  }

  private async calculateRankings(
    games: Game[],
    startDate: string,
  ): Promise<any[]> {
    const gameTransactionCountMap = new Map<number, number>();

    // 각 게임의 거래 횟수와 랭킹을 계산
    for (const game of games) {
      const count: number = await this.suiWeb3Service.getGamesTransactionCount(
        game.id,
        startDate,
      );
      gameTransactionCountMap.set(game.id, count);
    }

    // 거래 횟수를 기준으로 게임들을 정렬
    const sortedGames = Array.from(gameTransactionCountMap.entries()).sort(
      (a, b) => b[1] - a[1],
    );

    const result = sortedGames.map(([gameId, transactionCount], index) => ({
      ...games.find((game) => game.id === gameId),
      transactionCount,
      ranking: index + 1,
    }));

    for (const game of result) {
      console.log(game);
      await this.gameRepository.save(game);
    }

    // 랭킹을 부여하여 게임들을 반환
    return result;
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
    return game;
  }

  async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.findOne(id);
    Object.assign(game, updateGameDto);
    return this.gameRepository.save(game);
  }
}
