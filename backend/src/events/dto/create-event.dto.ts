import { IsDate, IsString, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CreatePricingDto } from "src/pricing/dto/create-pricing.dto";
import { Tiers } from "src/pricing/enums/pricing-tiers.enums";

export class CreateEventDto {
  @ApiProperty({
    description: "Title of the event",
    example: "AI Confer 2025",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "Description of the event",
    example: "An exciting tech conference about AI and cloud computing.",
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: "Start date and time of the event (ISO string)",
    example: "2025-09-15T09:00:00.000Z",
  })
  @Type(() => Date)
  @IsDate()
  startDateTime: Date;

  @ApiProperty({
    description: "End date and time of the event (ISO string)",
    example: "2025-09-15T18:00:00.000Z",
  })
  @Type(() => Date)
  @IsDate()
  endDateTime: Date;

  

  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: "Location of the event",
    example: "123 Main Street, Cityville",
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: "List of pricing tiers for the event (optional)",
    type: [CreatePricingDto],
    required: false,
    example: [
      {
        tier: Tiers.STUDENTS,
        pricing: 50,
        maxTickets: 100,
        soldTickets: 10,
        discountPercentage: 10,
        discountName: "Early Bird",
        discountStartDate: "2025-09-01T00:00:00.000Z",
        discountEndDate: "2025-09-10T23:59:59.000Z",
      },
      {
        tier: Tiers.VIP,
        pricing: 150,
        maxTickets: 50
      }
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePricingDto)
  pricings?: CreatePricingDto[];
}
