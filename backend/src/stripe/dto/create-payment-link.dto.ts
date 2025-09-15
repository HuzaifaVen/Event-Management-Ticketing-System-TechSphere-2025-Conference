import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StripeErrors } from '../constants/stripe.errors';

export class CreatePaymentLinkDto {
  @ApiProperty({
    description: 'ID of the pricing tier for which to create the payment link',
    example: '30931e6f-b36e-4e3b-a10f-8d76024c8d67',
    required: true,
  })
  @IsString({ message: StripeErrors.VALID_PRICEID})
  @IsNotEmpty({ message: StripeErrors.PRICEID_REQUIRED})
  priceId: string;
}
