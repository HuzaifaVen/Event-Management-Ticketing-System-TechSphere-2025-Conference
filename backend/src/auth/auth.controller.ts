import { Controller, Get, Post, Body,Put, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Res, Req } from '@nestjs/common';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from 'src/roles/enums/userRoles.dto';
import { VerifyLoginDto } from './dto/verify-login.dto';
import { Logger } from '@nestjs/common';
import { ApiBearerAuth,ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse,ApiTags } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { createMulterOptions  } from '../config/multer.config';
import { ReqUser } from './dto/req-user.decorator';
import { OAuthUserProfileDto } from './dto/Oauth-user-profile.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) { }


  //   Google OAuth Login
  @ApiOperation({ summary: 'Initiate Google OAuth Login' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
     this.logger.log('Google OAuth initiated');
  }

  //  Google OAuth Callback
  @ApiOperation({ summary: 'Google OAuth Callback' })
  @ApiResponse({ status: 200, description: 'OAuth Login successful' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@ReqUser(OAuthUserProfileDto) profile: OAuthUserProfileDto) {
  this.logger.log('Google OAuth callback triggered');
  return this.authService.validateOAuthLogin(profile, profile.provider, UserRole.CUSTOMER);
}

  
  // SignUp New User
  
  @ApiOperation({summary:"Signing Up new User"})
  @ApiCreatedResponse({description: "Signed Up", type: SignUpDto})
  @ApiConsumes("multipart/form-data") 
  @ApiBody({ type: SignUpDto }) 
  @Post('signup')
  @UseInterceptors(FileInterceptor('profileImg', createMulterOptions('uploads/users')))
  signUp(@Body() signUpDto: SignUpDto,@UploadedFile() file: Express.Multer.File,) {
    
    return this.authService.signUp(signUpDto,file);
  }


  // Login User
  @ApiOperation({summary: "Login User"})
  @ApiCreatedResponse({description:"Logged In", type: LoginDto})
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // @Post('refresh')
  // async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto){
  //   return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  // }

  // @Post('generate-otp')
  // async generateOtp(@Body("email") email: string){
  //   return this.authService.sendOtpMail(email)
  // }

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
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req){
    return await this.authService.changePassword(changePasswordDto,  req.userId);
  }


  // Forget Password Api
  @ApiOperation({ summary: 'Request password reset link' })
  @ApiBody({ type: ForgotPasswordDto })
  @Patch('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto ){
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  // Reset Password Api
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({ type: ResetPasswordDto })
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
    return await this.authService.resetPassword(resetPasswordDto)
  }

}
