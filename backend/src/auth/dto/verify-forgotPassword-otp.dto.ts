import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { OtpErrors } from 'src/otp/constants/otp.errors';
export class VerifyForgotPasswordOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user requesting password reset',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP sent to user email',
  })
  @IsString()
  @IsNotEmpty({ message: OtpErrors.OTP_REQUIRED })
  @Length(6,6, { message: 'OTP must be between 4 and 8 characters' })
  otp: string;
}
