import { IsEmail, IsString, IsNotEmpty,Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpErrors } from '../constants/otp.errors';
import { AuthMessages } from 'src/auth/constants/auth.messages';

export class VerifyOtpDto {
  @ApiProperty({ description: 'User email', required: true })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS})
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({ description: 'OTP code', required: true })
  @IsString({ message: OtpErrors.VALID_OTP })
  @IsNotEmpty({ message: OtpErrors.OTP_REQUIRED })
  @Length(6,6, { message: OtpErrors.OTP_REQUIREMENT })
  otp: string;
}
