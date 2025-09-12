import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllEventsQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by location', example: 'NYC' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Filter by pricing', example: 'VIP' })
  @IsOptional()
  @IsString()
  pricing?: string;

   @ApiPropertyOptional({ description: 'Filter events by user ID', example: 'f6aab3a8-31fe-466c-92ed-92ac5f7d96e2' })
  @IsOptional()
  @IsString()
  userId?: string;
}
