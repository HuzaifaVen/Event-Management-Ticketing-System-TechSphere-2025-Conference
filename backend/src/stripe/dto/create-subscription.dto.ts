import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StripeErrors } from '../constants/stripe.errors';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID of the customer subscribing',
    example: 'f6aab3a8-31fe-466c-92ed-92ac5f7d96e2',
    required: true,
  })
  @IsString({ message: StripeErrors.VALID_CUSTOMERID})
  @IsNotEmpty({ message: StripeErrors.CUSTOMERID_REQUIRED })
  customerId: string;

  @ApiProperty({
    description: 'ID of the pricing tier for the subscription',
    example: '30931e6f-b36e-4e3b-a10f-8d76024c8d67',
    required: true,
  })
  @IsString({ message: StripeErrors.VALID_PRICEID })
  @IsNotEmpty({ message: StripeErrors.PRICEID_REQUIRED })
  priceId: string;
}
