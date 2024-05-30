import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsUrl } from 'class-validator';

export class GameDto {
  @ApiProperty({
    description: 'The name of the game',
    example: 'My Awesome Game',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The package IDs associated with the game',
    example: [
      '0xf09c99aa87a706c4f010c8c6b86d0249ccf670a138dcbcc7af9f4da8573019fe',
      '0xef9124bfbeefc494e74ef7d4f4394018b7a094ccccb9a149a67eb04d4f79c034',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  readonly packageId: string[];

  @ApiProperty({
    description: 'The token coinType for the game',
    example:
      '0xa8816d3a6e3136e86bc2873b1f94a15cadc8af2703c075f2d546c2ae367f4df9::ocean::OCEAN',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly coinType?: string;

  @ApiProperty({
    description: 'The event type for the game',
    example: 'game',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly eventType?: string;

  @ApiProperty({
    description: 'The website URL of the game',
    example: 'https://example.com',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  readonly websiteUrl?: string;

  @ApiProperty({
    description: 'The Discord URL of the game',
    example: 'https://discord.gg/example',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  readonly discordUrl?: string;

  @ApiProperty({
    description: 'The Twitter URL of the game',
    example: 'https://twitter.com/example',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  readonly twitterUrl?: string;

  @ApiProperty({
    description: 'The image URL of the game',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  readonly imageUrl?: string;
}
