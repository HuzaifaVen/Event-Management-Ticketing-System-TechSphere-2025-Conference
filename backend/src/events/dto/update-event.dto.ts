import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePricingDto } from 'src/pricing/dto/create-pricing.dto';
import { EventErrors } from '../constants/event.errors';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiPropertyOptional({
    description: "Updated list of pricing tiers (optional)",
    type: [CreatePricingDto],
    example: [
      {
        tier: "VIP",
        pricing: 200,
        maxTickets: 40,
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: EventErrors.VALID_PRICING })
  @ValidateNested({ each: true })
  @Type(() => CreatePricingDto)
  pricings?: CreatePricingDto[];
}
