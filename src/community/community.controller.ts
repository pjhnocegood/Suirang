// src/community/community.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { Community } from '../entity/community.entity';

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new community post' })
  @ApiResponse({
    status: 201,
    description: 'The community post has been successfully created.',
    type: Community,
  })
  create(@Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
    return this.communityService.create(createCommunityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all community posts' })
  @ApiResponse({
    status: 200,
    description: 'Return all community posts',
    type: [Community],
  })
  findAll(): Promise<Community[]> {
    return this.communityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a community post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the community post',
    type: Community,
  })
  findOne(@Param('id') id: number): Promise<Community> {
    return this.communityService.findOne(id);
  }

  @Get('game/:gameId')
  @ApiOperation({ summary: 'Get community posts by game ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the community posts for the specified game',
    type: [Community],
  })
  findByGameId(@Param('gameId') gameId: number): Promise<Community[]> {
    return this.communityService.findByGameId(gameId);
  }
}
