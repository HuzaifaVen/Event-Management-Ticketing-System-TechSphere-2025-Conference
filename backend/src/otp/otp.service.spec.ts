import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OtpRequest } from './entities/otp.entity';
import { BadRequestException } from '@nestjs/common';
import { OtpErrors } from './constants/otp.errors';
import { OtpMessages } from './constants/otp.messages';

// ✅ Mock generateOtp BEFORE importing the service
jest.mock('./utils/generate-otp', () => ({
  generateOtp: jest.fn(() => 123456), // deterministic 6-digit OTP
}));

// ✅ Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(async (value: string) => `hashed-${value}`),
  compare: jest.fn(async (plain: string, hashed: string) => hashed === `hashed-${plain}`),
}));

import * as otpUtils from './utils/generate-otp';

describe('OtpService', () => {
  let service: OtpService;
  let otpRepository: any;
  let mockedGenerateOtp: jest.MockedFunction<typeof otpUtils.generateOtp>;

  beforeEach(async () => {
    otpRepository = {
      delete: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn(async (dto) => dto),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: getRepositoryToken(OtpRequest), useValue: otpRepository },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);

    // Cast mocked generateOtp
    mockedGenerateOtp = otpUtils.generateOtp as jest.MockedFunction<typeof otpUtils.generateOtp>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateOtp', () => {
    it('should delete existing OTPs, create new OTP, and return plain value', async () => {
      otpRepository.create.mockReturnValue({ email: 'test@example.com', otp: 'hashed-123456' });
      otpRepository.save.mockResolvedValue({ email: 'test@example.com', otp: 'hashed-123456' });

      const result = await service.generateOtp('test@example.com');

      // ✅ Test that generateOtp was called
      expect(mockedGenerateOtp).toHaveBeenCalled();

      expect(otpRepository.delete).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(otpRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com', otp: 'hashed-123456' }),
      );
      expect(otpRepository.save).toHaveBeenCalled();
      expect(result).toBe(123456);
    });
  });

  describe('verifyOtp', () => {
    it('should mark OTP verified and return success message', async () => {
      otpRepository.findOne.mockResolvedValue({
        email: 'test@example.com',
        otp: 'hashed-123456',
        expiresAt: new Date(Date.now() + 5000),
        verified: false,
      });

      const result = await service.verifyOtp('test@example.com', '123456');

      expect(result).toEqual({ message: OtpMessages.OTP_VERIFIED });
      expect(otpRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ verified: true }),
      );
    });
  });

  describe('verifyOtp error cases', () => {
    it('should throw if no OTP found', async () => {
      otpRepository.findOne.mockResolvedValue(null);

      await expect(service.verifyOtp('test@example.com', '123456')).rejects.toThrow(
        new BadRequestException(OtpErrors.OTP_NOT_FOUND),
      );
    });

    it('should throw if OTP expired', async () => {
      otpRepository.findOne.mockResolvedValue({
        email: 'test@example.com',
        otp: 'hashed-123456',
        expiresAt: new Date(Date.now() - 1000),
        verified: false,
      });

      await expect(service.verifyOtp('test@example.com', '123456')).rejects.toThrow(
        new BadRequestException(OtpErrors.OTP_EXPIRED),
      );
    });

    it('should throw if OTP does not match', async () => {
      otpRepository.findOne.mockResolvedValue({
        email: 'test@example.com',
        otp: 'hashed-123456',
        expiresAt: new Date(Date.now() + 5000),
        verified: false,
      });

      await expect(service.verifyOtp('test@example.com', '999999')).rejects.toThrow(
        new BadRequestException(OtpErrors.INVALID_OTP),
      );
    });
  });
});
