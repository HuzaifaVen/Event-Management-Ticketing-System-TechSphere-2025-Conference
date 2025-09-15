import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StripeErrors } from '../constants/stripe.errors';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'AI Conference Ticket',
    required: true,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Access to AI Conference 2025 sessions',
    required: true,
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 150,
    required: true,
  })
  @IsNumber({}, { message: StripeErrors.VALID_PRICE })
  @IsPositive({ message: StripeErrors.PRICE_ABOVE_ZERO })
  @IsNotEmpty({ message: StripeErrors.PRICE_REQUIRED })
  price: number;
}
