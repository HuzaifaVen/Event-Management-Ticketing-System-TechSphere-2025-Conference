import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyLoginDto } from './dto/verify-login.dto';
import { UserRole } from '../roles/enums/userRoles.dto';
import { AuthMessages } from './constants/auth.messages';
import { AuthErrors } from './constants/auth.errors';
import { AuthenticationGuard } from '../guards/auth.guard';


describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      signUp: jest.fn(),
      login: jest.fn(),
      verifyLoginOtp: jest.fn(),
      changePassword: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      validateOAuthLogin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
    .overrideGuard(AuthenticationGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Always allow
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp with correct params', async () => {
      const dto: SignUpDto = { name: 'Abdul Ahmed', email: 'abdul@gmail.com', password: 'Tmai12@1', role: UserRole.CUSTOMER };
      const mockResponse = { message: AuthMessages.USER_SIGNED_UP };
      authService.signUp.mockResolvedValue(mockResponse);

      const result = await controller.signUp(dto,undefined);
      expect(result).toBe(mockResponse);
      expect(authService.signUp).toHaveBeenCalledWith(dto,undefined);
    });
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const dto: LoginDto = { email: 'abdul@gmail.com', password: 'Tmai12@1' };
      const mockResponse = { message: AuthMessages.USER_LOGGED_IN };
      authService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(dto);
      expect(result).toBe(mockResponse);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('verifyOtp', () => {
    it('should call authService.verifyLoginOtp', async () => {
      const dto: VerifyLoginDto = { email: 'abdul@gmail.com', otp: 'Tmai12@1' };
      const mockResponse = { accessToken: 'token', refreshToken: 'refresh' };
      authService.verifyLoginOtp.mockResolvedValue(mockResponse);

      const result = await controller.verifyOtp(dto);
      expect(result).toBe(mockResponse);
      expect(authService.verifyLoginOtp).toHaveBeenCalledWith(dto);
    });
  });


  describe('changePassword', () => {
    it('should call authService.changePassword with req.userId', async () => {
      const dto: ChangePasswordDto = { oldPassword: 'Tmai12@1', newPassword: 'Peqi12@1' };
      const mockResponse = { message: AuthMessages.PASSWORD_CHANGED_SUCCESS };
      authService.changePassword.mockResolvedValue(mockResponse);

      const req = { userId: 1 };
      const result = await controller.changePassword(dto, req as any);
      expect(result).toBe(mockResponse);
      expect(authService.changePassword).toHaveBeenCalledWith(dto, req.userId);
    });
  });


  describe('forgotPassword', () => {
    it('should call authService.forgotPassword', async () => {
      const dto: ForgotPasswordDto = { email: 'abdul@gmail.com' };
      const mockResponse = { message: AuthMessages.OTP_FORWARDED_MESSAGE };
      authService.forgotPassword.mockResolvedValue(mockResponse);

      const result = await controller.forgotPassword(dto);
      expect(result).toBe(mockResponse);
      expect(authService.forgotPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('resetPassword', () => {
    it('should call authService.resetPassword', async () => {
      const dto: ResetPasswordDto = { email: 'john@test.com', otp: '1234', password: 'newPass' };
      const mockResponse = { accessToken: 'token', refreshToken: "token" };
      authService.resetPassword.mockResolvedValue(mockResponse);

      const result = await controller.resetPassword(dto);
      expect(result).toBe(mockResponse);
      expect(authService.resetPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('googleAuthRedirect', () => {
    it('should call authService.validateOAuthLogin', async () => {
      const profile = {
        provider: 'google',
        emails: [{ verified: true, value: 'john@test.com' }],
        displayName: 'John',
      };

      // ✅ Mock user with required properties
      const mockResponse = {
        user: {
          id: '1',
          name: 'John',
          email: 'john@test.com',
          provider: 'google',
          password: 'hashed', 
          isVerified: true,
          isBlocked: false,           
          profileImg: 'avatar.png',
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: '1',
          role: {} as any, 
        },
        token: 'jwt',
      };
      authService.validateOAuthLogin.mockResolvedValue(mockResponse);

      const result = await controller.googleAuthRedirect(profile as any);
      expect(result).toBe(mockResponse);
      expect(authService.validateOAuthLogin).toHaveBeenCalledWith(profile, profile.provider, UserRole.CUSTOMER);
    });
  });
});
