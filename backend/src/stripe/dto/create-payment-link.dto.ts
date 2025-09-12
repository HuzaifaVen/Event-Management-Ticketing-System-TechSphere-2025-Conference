import { IsString } from 'class-validator';

export class CreatePaymentLinkDto {
  @IsString()
  priceId: string;
}
