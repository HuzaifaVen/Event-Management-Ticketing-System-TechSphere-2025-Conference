import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { TicketErrors } from '../constants/ticket.errors';

export class ScanByQrDto {
  @ApiProperty({
    description: 'QR code of the ticket',
    example: 'abc123-xyz789',
    required: true,
  })
  @IsString({ message: TicketErrors.VALID_QRCODE})
  @IsNotEmpty({ message: TicketErrors.QR_CODE_REQUIRED })
  qrCode: string;
}
