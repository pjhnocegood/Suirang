import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsDateString, IsOptional, IsNumberString } from 'class-validator';
import { PaginationQueryDto } from './PaginationQueryDto';

export class GameParamsDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'ID of the game to retrieve',
    type: 'number',
  })
  @IsNumberString()
  gameId: number;

  @ApiHideProperty()
  walletAddress: string;

  @ApiPropertyOptional({
    description:
      'Optional. Start date for filtering game details (format: YYYY-MM-DD). If not provided, defaults to one month ago.',
    type: String,
    example: '2024-05-01',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;
}
