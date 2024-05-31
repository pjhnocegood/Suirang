import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { GameDto } from '../dto/game.dto';
import { Game } from '../entity/game.entity';
import { UpdateGameDto } from '../dto/update-game.dto';
import {
  CacheInterceptor,
  CacheKey,
  CACHE_MANAGER,
  Cache,
} from '@nestjs/cache-manager';
import { CacheTTL } from '@nestjs/common/cache';

@ApiTags('games')
@Controller('games')
@UseInterceptors(CacheInterceptor)
export class GameController {
  constructor(
    private readonly gameService: GameService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The game has been successfully created.',
  })
  @ApiBody({ type: GameDto })
  create(@Body() gameDto: GameDto): Promise<Game> {
    this.cacheManager.del('games');
    return this.gameService.create(gameDto);
  }

  @Get()
  @CacheTTL(1000 * 60 * 30)
  @CacheKey('games')
  @ApiOperation({ summary: 'Get all games with their rankings' })
  @ApiQuery({
    name: 'startDate',
    type: String,
    description:
      'Optional. Start date for filtering game details (format: YYYY-MM-DD). If not provided, defaults to one month ago.',
    example: '2024-05-01',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Return all games with their rankings',
    type: [Game],
  })
  findAllGamesWithRankings(
    @Query('startDate') startDate?: string,
  ): Promise<any[]> {
    if (!startDate) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      startDate = oneMonthAgo.toISOString().split('T')[0];
    }
    return this.gameService.findAllGamesWithRanking(startDate);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return the game with the given id.',
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the game to retrieve',
  })
  findOne(@Param('id') id: number): Promise<Game> {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The game has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @ApiBody({ type: GameDto })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the game to update',
  })
  update(
    @Param('id') id: number,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<Game> {
    this.cacheManager.del('games');
    const result = this.gameService.update(id, updateGameDto);

    return result;
  }
}
