import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTicketDto {
  @ApiProperty({
    description: "Event ID: ",
    example: "248bd4f0-a0e2-4b4c-a503-6ec3b6cedfda",
  })
  @IsString()
  eventId: string;

  @ApiProperty({
    description: "Pricing Tier Id: ",
    example: "30931e6f-b36e-4e3b-a10f-8d76024c8d67",
  })
  @IsString()
  pricingId: string;

//   @ApiProperty({
//     description: "QR CODE: ",
//     example: "TICKET-QR-123456",
//     required: false,
//   })
  @IsOptional()
  @IsString()
  qrCode?: string;

//   @ApiProperty({
//     description: "Flag to indicate if the ticket has been used",
//     example: false,
//     required: false,
//   })
  @IsOptional()
  @IsBoolean()
  isUsed?: boolean;
}
