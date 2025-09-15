import { IsEnum, IsNumber, Min, IsOptional, IsString, IsDateString, IsNotEmpty } from "class-validator";
import { Tiers } from "../enums/pricing-tiers.enums";
import { ApiProperty } from "@nestjs/swagger";
import { PricingErrors } from "../constants/pricing.errors"; // create this file for centralized error messages

export class CreatePricingDto {
  @ApiProperty({
    description: "Tier of pricing",
    enum: Tiers,
    example: Tiers.STUDENTS,
    required: true,
  })
  @IsEnum(Tiers, { message: PricingErrors.VALID_TIER })
  @IsNotEmpty({ message: PricingErrors.REQUIRED_TIER })
  tier: Tiers;

  @ApiProperty({
    description: "Price for this tier",
    example: 50,
    required: true,
  })
  @IsNumber({}, { message: PricingErrors.VALID_PRICING })
  @Min(0, { message: PricingErrors.MIN_PRICING })
  pricing: number;

  @ApiProperty({
    description: "Maximum number of tickets available for this tier",
    example: 100,
    required: true,
  })
  @IsNumber({}, { message: PricingErrors.VALID_MAX_TICKETS })
  @Min(1, { message: PricingErrors.MIN_MAX_TICKETS })
  maxTickets: number;

  @ApiProperty({
    description: "Number of tickets already sold (optional)",
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: PricingErrors.VALID_SOLD_TICKETS })
  @Min(0, { message: PricingErrors.MIN_SOLD_TICKETS })
  soldTickets?: number;

  @ApiProperty({
    description: "Discount percentage (optional)",
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: PricingErrors.VALID_DISCOUNT_PERCENTAGE })
  @Min(0, { message: PricingErrors.MIN_DISCOUNT_PERCENTAGE })
  discountPercentage?: number;

  @ApiProperty({
    description: "Discount name (optional)",
    example: "Early Bird",
    required: false,
  })
  @IsOptional()
  @IsString({ message: PricingErrors.VALID_DISCOUNT_NAME })
  discountName?: string;

  @ApiProperty({
    description: "Discount start date (optional, ISO string)",
    example: "2025-10-01T10:00:00.000Z",
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: PricingErrors.VALID_DISCOUNT_START_DATE })
  discountStartDate?: Date;

  @ApiProperty({
    description: "Discount end date (optional, ISO string)",
    example: "2025-10-10T23:59:59.000Z",
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: PricingErrors.VALID_DISCOUNT_END_DATE })
  discountEndDate?: Date;
}
