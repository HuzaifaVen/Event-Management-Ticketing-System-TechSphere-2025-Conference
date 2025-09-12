import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  currency: string;
}
