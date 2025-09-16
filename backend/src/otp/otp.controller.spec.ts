import { Test, TestingModule } from '@nestjs/testing';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

describe('OtpController', () => {
  let controller: OtpController;
  let otpService: jest.Mocked<OtpService>;

  const mockOtpService = {
    generateOtp: jest.fn(),
    verifyOtp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpController],
      providers: [
        { provide: OtpService, useValue: mockOtpService },
      ],
    }).compile();

    controller = module.get<OtpController>(OtpController);
    otpService = module.get(OtpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestOtp', () => {
    it('should call otpService.generateOtp with email and return success message', async () => {
      otpService.generateOtp.mockResolvedValue('123456');
      const dto = { email: 'test@example.com' };

      // Act
      const result = await controller.requestOtp(dto);

      expect(otpService.generateOtp).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual({ message: 'OTP sent successfully' });
    });
  });

  describe('verifyOtp', () => {
    it('should call otpService.verifyOtp with email + otp and return result', async () => {
      const expected = { message: 'OTP verified successfully' };
      otpService.verifyOtp.mockResolvedValue(expected);

      const dto = { email: 'test@example.com', otp: '123456' };
      const result = await controller.verifyOtp(dto);

      expect(otpService.verifyOtp).toHaveBeenCalledWith(dto.email, dto.otp);
      expect(result).toBe(expected);
    });
  });
});
