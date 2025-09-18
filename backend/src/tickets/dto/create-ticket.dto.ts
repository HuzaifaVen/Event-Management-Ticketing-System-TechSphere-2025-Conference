import { IsBoolean, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TicketErrors } from "../constants/ticket.errors";

export class CreateTicketDto {
  @ApiProperty({
    description: "Event ID",
    example: "248bd4f0-a0e2-4b4c-a503-6ec3b6cedfda",
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: TicketErrors.EVENTID_IS_REQUIRED })
  eventId: string;

  @ApiProperty({
    description: "Pricing Tier ID",
    example: "30931e6f-b36e-4e3b-a10f-8d76024c8d67",
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: TicketErrors.PRICINGID_IS_REQUIRED })
  pricingId: string;

  @IsOptional()
  @IsString()
  qrCode?: string;

  @IsOptional()
  @IsBoolean()
  isUsed?: boolean;
}
