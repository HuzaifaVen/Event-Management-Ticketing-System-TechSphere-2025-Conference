import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthMessages } from 'src/auth/constants/auth.messages';

export class OtpRequestDto {
  @ApiProperty({
    description: 'Email of the user requesting OTP',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS})
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;
}
