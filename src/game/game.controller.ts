import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { GameService } from './game.service';

import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { GameDto } from '../dto/game.dto';
import { Game } from '../entity/game.entity';
import { UpdateGameDto } from '../dto/update-game.dto';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The game has been successfully created.',
  })
  @ApiBody({ type: GameDto })
  create(@Body() gameDto: GameDto): Promise<Game> {
    return this.gameService.create(gameDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all games.' })
  findAll(): Promise<Game[]> {
    return this.gameService.findAll();
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
    return this.gameService.update(id, updateGameDto);
  }
}
