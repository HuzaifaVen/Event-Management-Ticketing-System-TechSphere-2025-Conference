
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpRequest } from './entities/otp.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { OtpMessages } from './constants/otp.messages';
import { OtpErrors } from './constants/otp.errors';
import * as otpUtils from './utils/generate-otp';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpRequest)
    private readonly otpRepository: Repository<OtpRequest>,
  ) {}

  async generateOtp(email: string) {
  // Delete existing OTPs for this email
  await this.otpRepository.delete({ email });

  // Generate new OTP
  const otpPlain =  otpUtils.generateOtp();

  const hashedOtp = await bcrypt.hash(otpPlain.toString(), 10);

  const otpRecord = this.otpRepository.create({
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
  });

  await this.otpRepository.save(otpRecord);

  return otpPlain; 
}


  async verifyOtp(email: string, otp: string) {
  const otpRecord = await this.otpRepository.findOne({ where: { email } });

  if (!otpRecord) throw new BadRequestException(OtpErrors.OTP_NOT_FOUND);
  if (otpRecord.expiresAt < new Date()) throw new BadRequestException(OtpErrors.OTP_EXPIRED);

  const isMatch = await bcrypt.compare(otp, otpRecord.otp);
  if (!isMatch) throw new BadRequestException(OtpErrors.INVALID_OTP);

  otpRecord.verified = true;
  await this.otpRepository.save(otpRecord);

  return { message: OtpMessages.OTP_VERIFIED };
}

}
