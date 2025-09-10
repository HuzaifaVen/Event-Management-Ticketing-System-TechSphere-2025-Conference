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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

   @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req ) {
    return this.authService.validateOAuthLogin(req.user, 'google',UserRole.CUSTOMER);
  }


  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Post('generate-otp')
  async generateOtp(@Body("email") email: string){
    return this.authService.sendOtpMail(email)
  }

  @Post('verify-login-otp')
  async verifyOtp(@Body() verifyLoginDto: VerifyLoginDto) {
    return this.authService.verifyLoginOtp(verifyLoginDto);
  }

  @UseGuards(AuthenticationGuard)
  @Put('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req){
    console.log("progress")
    return await this.authService.changePassword(changePasswordDto,  req.userId);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto ){
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
    return await this.authService.resetPassword(resetPasswordDto.email,resetPasswordDto.otp,resetPasswordDto.password)
  }

}
