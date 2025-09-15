import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EventErrors } from '../constants/event.errors';

export class FindAllEventsQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: EventErrors.VALID_START_DATE }) 
  @Min(1, { message: 'Page must be at least 1' }) 
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by location', example: 'NYC' })
  @IsOptional()
  @IsString({ message: EventErrors.VALID_LOCATION })
  location?: string;

  @ApiPropertyOptional({ description: 'Filter by pricing', example: 'VIP' })
  @IsOptional()
  @IsString({ message: EventErrors.VALID_PRICING })
  pricing?: string;

  @ApiPropertyOptional({ description: 'Filter events by user ID', example: 'f6aab3a8-31fe-466c-92ed-92ac5f7d96e2' })
  @IsOptional()
  @IsString({ message: EventErrors.VALID_USERID })
  userId?: string;
}
