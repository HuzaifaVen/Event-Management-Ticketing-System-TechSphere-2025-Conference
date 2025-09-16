import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { Roles } from '../roles/entities/roles.entity';
import { OtpService } from '../otp/otp.service';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { RoleServices } from '../roles/roles.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthErrors } from './constants/auth.errors';
import { AuthMessages } from './constants/auth.messages';


jest.mock('../../helpers/password.helper', () => ({
  comparePasswords: jest.fn(),
}));

import { comparePasswords } from '../../helpers/password.helper';



jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any;
  let refreshTokenRepository: any;
  let rolesRepository: any;
  let otpService: any;
  let mailerService: any;
  let jwtService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn(), save: jest.fn(), create: jest.fn(), update: jest.fn() },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: { findOne: jest.fn(), save: jest.fn(), remove: jest.fn() },
        },
        {
          provide: getRepositoryToken(Roles),
          useValue: { findOne: jest.fn(), save: jest.fn() },
        },
        { provide: OtpService, useValue: { generateOtp: jest.fn(), verifyOtp: jest.fn() } },
        { provide: MailerService, useValue: { sendMail: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('mockJwtToken') } },
        { provide: RoleServices, useValue: { createRole: jest.fn(), getRoleById: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('testValue') } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    refreshTokenRepository = module.get(getRepositoryToken(RefreshToken));
    rolesRepository = module.get(getRepositoryToken(Roles));
    otpService = module.get(OtpService);
    mailerService = module.get(MailerService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException if token is not found', async () => {
      refreshTokenRepository.findOne.mockResolvedValue(null);
      await expect(service.refreshTokens('invalidToken')).rejects.toThrow(UnauthorizedException);
    });

    it('should return new tokens when valid refresh token is found', async () => {
      refreshTokenRepository.findOne.mockResolvedValue({ token: 'valid', userId: 1 });
      refreshTokenRepository.remove.mockResolvedValue({});
      jest.spyOn(service, 'generateUserToken').mockResolvedValue({ accessToken: 'a', refreshToken: 'b' });

      const result = await service.refreshTokens('valid');
      expect(result).toEqual({ accessToken: 'a', refreshToken: 'b' });
      expect(refreshTokenRepository.remove).toHaveBeenCalled();
    });
  });

  describe('sendOtpMail', () => {
    it('should send an email with OTP', async () => {
      otpService.generateOtp.mockResolvedValue('1234');
      mailerService.sendMail.mockResolvedValue({});

      const result = await service.sendOtpMail('test@example.com');
      expect(result.message).toBe(AuthMessages.OTP_FORWARDED_MESSAGE);
      expect(mailerService.sendMail).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.forgotPassword({ email: 'notfound@test.com' }))
        .rejects.toThrow(NotFoundException);
    });

    it('should send OTP if user exists', async () => {
      userRepository.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' });
      jest.spyOn(service, 'sendOtpMail').mockResolvedValue({ message: 'otp-sent' });

      const result = await service.forgotPassword({ email: 'test@test.com' });
      expect(result.message).toBe(AuthMessages.OTP_FORWARDED_MESSAGE);
      expect(service.sendOtpMail).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should throw if user does not exist', async () => {
      otpService.verifyOtp.mockResolvedValue(true);
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.resetPassword({ email: 'x', otp: '1234', password: 'new' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should update password if valid', async () => {
      otpService.verifyOtp.mockResolvedValue(true);
      userRepository.findOne.mockResolvedValue({ id: 1, email: 'x' });
      userRepository.update.mockResolvedValue({});
      jest.spyOn(service, 'generateUserToken').mockResolvedValue({ accessToken: 'a', refreshToken: 'b' });

      const result = await service.resetPassword({ email: 'x', otp: '1234', password: 'new' });
      expect(result).toEqual({ accessToken: 'a', refreshToken: 'b' });
      expect(userRepository.update).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.login({ email: 'x', password: 'y' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password does not match', async () => {
      userRepository.findOne.mockResolvedValue({ password: 'hashed' });
      (comparePasswords as jest.Mock).mockResolvedValue(false); 

      await expect(service.login({ email: 'x', password: 'y' })).rejects.toThrow(UnauthorizedException);
    });
  });
});
