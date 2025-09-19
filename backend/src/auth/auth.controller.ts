import { Controller, Get, Post, Query, Body, Put, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../guards/auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Res, Req } from '@nestjs/common';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from '../roles/enums/userRoles.dto';
import { VerifyLoginDto } from './dto/verify-login.dto';
import { Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadedFile } from '@nestjs/common';
import { createMulterOptions } from '../config/multer.config';
import { OAuthUserProfileDto } from './dto/Oauth-user-profile.dto';
import type { Response } from 'express';
import { VerifyForgotPasswordOtpDto } from './dto/verify-forgotPassword-otp.dto';
import type { AuthenticatedRequest } from './dto/authenticated-request.interface';
import { GoogleAuthQueryDto } from './dto/googleAuthQueryDto';
import { RedirectGoogleUrl } from 'helpers/googleRedirectUrl.helper';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator.dto';
import { USER_UPLOAD_PATH } from '../../constants/upload_paths';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  googleAuth(@Query() query: GoogleAuthQueryDto, @Res() res: Response) {
    const { role } = query;
    const state = role ? Buffer.from(JSON.stringify({ role })).toString('base64') : undefined;
    const googleUrl = RedirectGoogleUrl(state);
    return res.redirect(googleUrl);
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth Callback' })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    this.logger.log('Google OAuth callback triggered');

    const redirectUrl = await this.authService.handleGoogleCallback(req.user);

    return res.redirect(redirectUrl);
  }


  // SignUp New User

  @ApiOperation({ summary: "Signing Up new User" })
  @ApiCreatedResponse({ description: "Signed Up", type: SignUpDto })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: SignUpDto })
  @Post('signup')
  @UseInterceptors(FileInterceptor('profileImg', createMulterOptions(USER_UPLOAD_PATH)))
  signUp(@Body() signUpDto: SignUpDto, @UploadedFile() file?: Express.Multer.File,) {

    return this.authService.signUp(signUpDto, file);
  }


  // Login User
  @ApiOperation({ summary: "Login User" })
  @ApiCreatedResponse({ description: "Logged In", type: LoginDto })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Verify OTP After Login
  @ApiOperation({ summary: 'Verify Login OTP' })
  @ApiBody({ type: VerifyLoginDto })
  @Post('verify-login-otp')
  async verifyOtp(@Body() verifyLoginDto: VerifyLoginDto) {
    return this.authService.verifyLoginOtp(verifyLoginDto);
  }

  // Change Authenticated User Password
  @ApiOperation({ summary: 'Change password (Authenticated users only)' })
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @CurrentUserId() userId: string) {
    return await this.authService.changePassword(changePasswordDto, userId);
  }

  @ApiOperation({ summary: 'Verify OTP for forgot-password flow' })
  @ApiBody({ type: VerifyForgotPasswordOtpDto })
  @Post('verify-forgot-password-otp')
  async verifyForgotPasswordOtp(@Body() dto: VerifyForgotPasswordOtpDto) {
    return await this.authService.verifyForgotPasswordOtp(dto);
  }


  // Forget Password Api
  @ApiOperation({ summary: 'Request password reset link' })
  @ApiBody({ type: ForgotPasswordDto })
  @Patch('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  // Reset Password Api
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({ type: ResetPasswordDto })
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto)
  }

}
