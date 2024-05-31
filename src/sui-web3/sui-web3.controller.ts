import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { SuiWeb3Service } from './sui-web3.service';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GameParamsDto } from '../dto/GameParamsDto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheTTL } from '@nestjs/common/cache';
@ApiTags('sui-web3')
@Controller('sui-web3')
export class SuiWeb3Controller {
  constructor(private readonly suiWeb3Service: SuiWeb3Service) {}

  @Get('ranking/:gameId')
  @ApiResponse({
    status: 200,
    description: 'Return the game details for the given gameId.',
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @ApiParam({
    name: 'gameId',
    type: 'number',
    description: 'ID of the game to retrieve',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description:
      'Optional. Start date for filtering game details (format: YYYY-MM-DD). If not provided, defaults to one month ago.',
    type: String,
    example: '2024-05-01',
    schema: { format: 'date' }, // date 형식으로 지정
  })
  getGameDetails(
    @Param('gameId') gameId: number,
    @Query('startDate') startDate?: string,
  ) {
    if (!startDate) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      startDate = oneMonthAgo.toISOString().split('T')[0];
    }
    return this.suiWeb3Service.getRankingList(gameId, startDate);
  }

  @Get('asset-tracking/nft/:gameId')
  @ApiResponse({
    status: 200,
    description: 'Return the game details for the given gameId.',
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000 * 60 * 15)
  getNFTAssetTracking(@Query() gameParamsDto: GameParamsDto) {
    if (!gameParamsDto.startDate) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      gameParamsDto.startDate = oneMonthAgo.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    }
    return this.suiWeb3Service.getNftAssetTracking(
      gameParamsDto.gameId,
      gameParamsDto.walletAddress,
      gameParamsDto.startDate,
      gameParamsDto.page,
      gameParamsDto.pageSize,
    );
  }

  @Get('asset-tracking/coin/:gameId')
  @ApiResponse({
    status: 200,
    description: 'Return the game details for the given gameId.',
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000 * 60 * 15)
  getCoinAssetTracking(@Query() gameParamsDto: GameParamsDto) {
    if (!gameParamsDto.startDate) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      gameParamsDto.startDate = oneMonthAgo.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    }
    return this.suiWeb3Service.getCoinAssetTracking(
      gameParamsDto.gameId,
      gameParamsDto.walletAddress,
      gameParamsDto.startDate,
      gameParamsDto.page,
      gameParamsDto.pageSize,
    );
  }
  @Get('event/:gameId')
  @ApiResponse({
    status: 200,
    description: 'Return the game details for the given gameId.',
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000 * 60 * 15)
  getEvent(@Query() gameParamsDto: GameParamsDto) {
    if (!gameParamsDto.startDate) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      gameParamsDto.startDate = oneMonthAgo.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    }
    return this.suiWeb3Service.getEvent(
      gameParamsDto.gameId,
      gameParamsDto.walletAddress,
      gameParamsDto.startDate,
      gameParamsDto.page,
      gameParamsDto.pageSize,
    );
  }
}
