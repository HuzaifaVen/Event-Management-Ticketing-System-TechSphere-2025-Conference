import { IsUUID, IsEnum, IsNumber, Min, IsOptional, IsString, IsDateString } from 'class-validator';
import { Tiers } from '../enums/pricing-tiers.enums';
import { IsArray,ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePricingDto {

  @IsEnum(Tiers)
  tier: Tiers;

  @IsNumber()
  @Min(0)
  pricing: number;

  @IsNumber()
  @Min(1)
  maxTickets: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  soldTickets?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number;

  @IsOptional()
  @IsString()
  discountName?: string;

  @IsOptional()
  @IsDateString()
  discountStartDate?: Date;

  @IsOptional()
  @IsDateString()
  discountEndDate?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePricingDto)
  pricings: CreatePricingDto[];
}
