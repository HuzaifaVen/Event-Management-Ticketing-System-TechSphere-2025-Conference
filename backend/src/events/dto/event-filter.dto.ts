// dto/event-filters.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class EventFiltersDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  pricing?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
