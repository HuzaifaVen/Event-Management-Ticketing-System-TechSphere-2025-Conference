import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthMessages } from '../constants/auth.messages';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email of the user requesting password reset',
    example: 'abdullah12@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS })
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;
}
