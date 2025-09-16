// otp-verify.dto.ts

import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthMessages } from '../../../auth/constants/auth.messages';
import { OtpErrors } from '../../../otp/constants/otp.errors';

export class OtpVerifyDto {
  @ApiProperty({
    description: 'Email of the user verifying OTP',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS })
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED})
  email: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
    required: true,
  })
  @IsString({ message: OtpErrors.VALID_OTP})
  @IsNotEmpty({ message: OtpErrors.OTP_REQUIRED })
  @Length(6, 6, { message: OtpErrors.OTP_REQUIREMENT })
  otp: string;
}

