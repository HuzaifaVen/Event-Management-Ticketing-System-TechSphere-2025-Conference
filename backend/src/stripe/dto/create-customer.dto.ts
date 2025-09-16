import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthErrors } from '../../auth/constants/auth.errors';
import { AuthMessages } from '../../auth/constants/auth.messages';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Email address of the customer',
    example: 'abdullah12@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS })
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({
    description: 'Full name of the customer',
    example: 'Abdullah Ahmed',
    required: true,
  })
  @IsString({ message: AuthErrors.VALID_NAME })
  @IsNotEmpty({ message: AuthErrors.NAME_IS_REQUIRED })
  name: string;
}
