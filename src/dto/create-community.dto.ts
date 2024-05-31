// src/posts/dto/create-post.dto.ts
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateCommunityDto {
  @ApiProperty({
    example: '0x1234...',
    description: 'Wallet address of the user',
  })
  @IsString()
  walletAddress: string;

  @ApiHideProperty()
  @IsInt()
  eventCount: number;

  @ApiProperty({
    example: 'This is a post content.',
    description: 'Content of the post',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the game associated with the post',
  })
  @IsInt()
  gameId: number;
}
