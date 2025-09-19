import { IsDate, IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CreatePricingDto } from "src/pricing/dto/create-pricing.dto";
import { Tiers } from "src/pricing/enums/pricing-tiers.enums";
import { EventErrors } from "../constants/event.errors";
import { AuthErrors } from "src/auth/constants/auth.errors";

export class CreateEventDto {
  @ApiProperty({
    description: "Title of the event",
    example: "AI Confer 2025",
    required: true,
  })
  @IsString({ message: EventErrors.VALID_TITLE })
  @IsNotEmpty({ message: EventErrors.REQUIRED_TITLE })
  title: string;

  @ApiProperty({
    description: "URL or file path for the user's profile image",
    example: "/uploads/user123.png",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: AuthErrors.VALID_PROFILE })
  profileImg?: string;

  @ApiProperty({
    description: "Description of the event",
    example: "An exciting tech conference about AI and cloud computing.",
    required: true,
  })
  @IsString({ message: EventErrors.VALID_DESCRIPTION })
  @IsNotEmpty({ message: EventErrors.REQUIRED_DESCRIPTION })
  description: string;

  @ApiProperty({
    description: "Start date and time of the event (ISO string)",
    example: "2025-09-15T09:00:00.000Z",
    required: true,
  })
  @Type(() => Date)
  @IsDate({ message: EventErrors.VALID_START_DATE })
  startDateTime: Date;

  @ApiProperty({
    description: "End date and time of the event (ISO string)",
    example: "2025-09-15T18:00:00.000Z",
    required: true,
  })
  @Type(() => Date)
  @IsDate({ message: EventErrors.VALID_END_DATE })
  endDateTime: Date;

  @ApiProperty({
    description: "User ID of the event creator",
    example: "248bd4f0-a0e2-4b4c-a503-6ec3b6cedfda",
    required: false,
  })

  @IsOptional()
  @IsString({ message: EventErrors.VALID_USERID })
  userId?: string;

  @ApiProperty({
    description: "Location of the event",
    example: "123 Main Street, Cityville",
    required: true,
  })
  @IsString({
    message: EventErrors.VALID_LOCATION
  })
  @IsNotEmpty({ message: EventErrors.REQUIRED_LOCATION })
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
  @IsArray({ message: EventErrors.VALID_PRICING })
  @ValidateNested({ each: true })
  @Type(() => CreatePricingDto)
  pricings?: CreatePricingDto[];
}
