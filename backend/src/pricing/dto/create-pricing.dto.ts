import { IsUUID, IsEnum, IsNumber, Min, IsOptional, IsString, IsDateString } from "class-validator";
import { Tiers } from "../enums/pricing-tiers.enums";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePricingDto {
  @ApiProperty({
    description: "Tier of pricing",
    enum: Tiers,
    example: Tiers.STUDENTS,
  })
  @IsEnum(Tiers)
  tier: Tiers;

  @ApiProperty({
    description: "Price for this tier",
    example: 50,
  })
  @IsNumber()
  @Min(0)
  pricing: number;

  @ApiProperty({
    description: "Maximum number of tickets available for this tier",
    example: 100,
  })
  @IsNumber()
  @Min(1)
  maxTickets: number;

  @ApiProperty({
    description: "Number of tickets already sold (optional)",
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  soldTickets?: number;

  @ApiProperty({
    description: "Discount percentage (optional)",
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number;

  @ApiProperty({
    description: "Discount name (optional)",
    example: "Early Bird",
    required: false,
  })
  @IsOptional()
  @IsString()
  discountName?: string;

  @ApiProperty({
    description: "Discount start date (optional, ISO string)",
    example: "2025-10-01T10:00:00.000Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  discountStartDate?: Date;

  @ApiProperty({
    description: "Discount end date (optional, ISO string)",
    example: "2025-10-10T23:59:59.000Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  discountEndDate?: Date;
}
