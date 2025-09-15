import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty } from "class-validator";
import { OtpErrors } from "src/otp/constants/otp.errors";
import { AuthMessages } from "../constants/auth.messages";

export class VerifyLoginDto {
  @ApiProperty({
    description: "Enter Email",
    example: "abdullah12@gmail.com",
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS})
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED})
  email: string;

  @ApiProperty({
    description: "Enter OTP",
    example: "123456",
    required: true,
  })
  @IsString({ message: OtpErrors.VALID_OTP})
  @IsNotEmpty({ message: OtpErrors.OTP_REQUIRED })
  otp: string;
}
