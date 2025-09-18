import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StripeErrors } from '../constants/stripe.errors';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'Amount for the payment intent',
    example: 150,
    required: true,
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be greater than zero' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @ApiProperty({
    description: 'Currency for the payment intent',
    example: 'USD',
    required: true,
  })
  @IsString({ message: StripeErrors.VALID_CURRENCY })
  @IsNotEmpty({ message: StripeErrors.CURRENCY_REQUIRED})
  currency: string;
}
