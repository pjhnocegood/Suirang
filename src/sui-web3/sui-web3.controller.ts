import { Controller, Get, Param, Query } from '@nestjs/common';
import { SuiWeb3Service } from './sui-web3.service';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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

  @Get('asset-tracking/nft/:gameId/:walletAddress')
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
  @ApiParam({
    name: 'walletAddress',
    type: 'string',
    description: 'Wallet address of the user to retrieve',
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
  getNFTAssetTracking(
    @Param('gameId') gameId: number,
    @Param('walletAddress') walletAddress: string,
    @Query('startDate') startDate?: string,
  ) {
    if (!startDate) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      startDate = oneMonthAgo.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    }
    return this.suiWeb3Service.getNftAssetTracking(
      gameId,
      walletAddress,
      startDate,
    );
  }

  @Get('asset-tracking/coin/:gameId/:walletAddress')
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
  @ApiParam({
    name: 'walletAddress',
    type: 'string',
    description: 'Wallet address of the user to retrieve',
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
  getCoinAssetTracking(
    @Param('gameId') gameId: number,
    @Param('walletAddress') walletAddress: string,
    @Query('startDate') startDate?: string,
  ) {
    if (!startDate) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      startDate = oneMonthAgo.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    }
    return this.suiWeb3Service.getCoinAssetTracking(
      gameId,
      walletAddress,
      startDate,
    );
  }
}
