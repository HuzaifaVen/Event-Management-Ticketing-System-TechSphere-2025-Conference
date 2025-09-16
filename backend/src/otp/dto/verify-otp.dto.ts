import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpErrors } from '../constants/otp.errors';
import { AuthErrors } from '../../auth/constants/auth.errors';
import { AuthMechanism } from 'typeorm';
import { AuthMessages } from '../../auth/constants/auth.messages';

export class VerifyOtpDto {
  @ApiProperty({ description: 'User email', required: true })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS})
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({ description: 'OTP code', required: true })
  @IsString({ message: OtpErrors.VALID_OTP })
  @IsNotEmpty({ message: OtpErrors.OTP_REQUIRED })
  otp: string;
}
