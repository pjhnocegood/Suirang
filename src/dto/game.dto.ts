import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

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
}
