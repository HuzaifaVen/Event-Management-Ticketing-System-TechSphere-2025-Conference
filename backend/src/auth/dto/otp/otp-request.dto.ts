// otp-request.dto.ts
import { IsEmail } from 'class-validator';

export class OtpRequestDto {
  @IsEmail()
  email: string;
}
