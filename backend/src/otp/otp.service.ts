// src/otp/otp.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpRequest } from './entities/otp.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

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
  const otpPlain = crypto.randomInt(100000, 1000000).toString(); // 6 digits
  const hashedOtp = await bcrypt.hash(otpPlain, 10);

  const otpRecord = this.otpRepository.create({
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
  });

  await this.otpRepository.save(otpRecord);
  console.log("otp: " ,otpPlain)

  return otpPlain; 
}


  async verifyOtp(email: string, otp: string) {
  const otpRecord = await this.otpRepository.findOne({ where: { email } });

  if (!otpRecord) throw new BadRequestException('OTP not found');
  if (otpRecord.expiresAt < new Date()) throw new BadRequestException('OTP expired');

  const isMatch = await bcrypt.compare(otp, otpRecord.otp);
  if (!isMatch) throw new BadRequestException('Invalid OTP');

  otpRecord.verified = true;
  await this.otpRepository.save(otpRecord);

  return { message: 'OTP verified successfully' };
}

}
