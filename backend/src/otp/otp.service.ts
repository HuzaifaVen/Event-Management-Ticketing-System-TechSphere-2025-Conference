
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpRequest } from './entities/otp.entity';
import { OtpMessages } from './constants/otp.messages';
import { OtpErrors } from './constants/otp.errors';
import { compareOtp, hashOtp, otpGenerator } from 'helpers/otp-generator.helper';

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
  const otpPlain = otpGenerator(); // 6 digits
  const hashedOtp = await hashOtp(otpPlain, 10);

  const otpRecord = this.otpRepository.create({
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
  });

  await this.otpRepository.save(otpRecord);

  return otpPlain; 
}


  async verifyOtp(email: string, otp: string) {
  const otpRecord = await this.otpRepository.findOne({ where: { email } });

  if (!otpRecord) throw new BadRequestException(OtpErrors.OTP_NOT_FOUND);
  if (otpRecord.expiresAt < new Date()) throw new BadRequestException(OtpErrors.OTP_EXPIRED);

  const isMatch = await compareOtp(otp,otpRecord.otp);
  if (!isMatch) throw new BadRequestException(OtpErrors.INVALID_OTP);

  otpRecord.verified = true;
  await this.otpRepository.save(otpRecord);

  return { message: OtpMessages.OTP_VERIFIED };
}

}
