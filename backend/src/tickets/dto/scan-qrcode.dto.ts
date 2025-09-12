// src/tickets/dto/get-ticket-by-qr.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScanByQrDto {
  @ApiProperty({
    description: 'QR code of the ticket',
    example: 'abc123-xyz789',
  })
  @IsString()
  qrCode: string;
}
