// src/otp/otp.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // // @Post('request')
  // async requestOtp(@Body() dto: RequestOtpDto) {
  //   const otp = await this.otpService.generateOtp(dto.email);
  //   return { message: 'OTP sent successfully' };
  // }

  // // @Post('verify')
  // async verifyOtp(@Body() dto: VerifyOtpDto) {
  //   return this.otpService.verifyOtp(dto.email, dto.otp);
  // }
}
