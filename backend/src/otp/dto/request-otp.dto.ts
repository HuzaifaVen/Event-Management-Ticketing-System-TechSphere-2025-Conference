import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthMessages } from 'src/auth/constants/auth.messages';

export class RequestOtpDto {
  @ApiProperty({
    description: 'Email address to request OTP',
    example: 'abdullah12@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS })
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;
}
