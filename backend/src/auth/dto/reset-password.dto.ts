import { IsString, MinLength, Matches, IsEmail, IsNotEmpty } from 'class-validator';
import { AuthErrors } from '../constants/auth.errors';
import { ApiProperty } from '@nestjs/swagger';
import { AuthMechanism } from 'typeorm';
import { AuthMessages } from '../constants/auth.messages';
import { OtpErrors } from '../../otp/constants/otp.errors';
import { Password } from '../../decorators/password.decorator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email of the user resetting password',
    example: 'abdullah12@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS})
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({
    description: 'OTP code sent to the user',
    example: '232423',
    required: true,
  })
  @IsString({ message: OtpErrors.VALID_OTP})
  @IsNotEmpty({ message: OtpErrors.OTP_REQUIRED })
  otp: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'plaw12!@',
    required: true,
  })
  @IsString({ message: AuthErrors.PASSWORD_VALID })
  @IsNotEmpty({ message: AuthErrors.PASSWORD_REQUIRED })
  @MinLength(8, { message: AuthErrors.Validation_PASSWORD})
  @Password({ message: AuthErrors.Validation_PASSWORD })
  password: string;
}
