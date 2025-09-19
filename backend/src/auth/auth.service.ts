import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../roles/enums/userRoles.dto';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpService } from '../otp/otp.service';
import { Roles } from '../roles/entities/roles.entity';
import { RoleServices } from '../roles/roles.service';
import { DefaultRolePermissions } from '../roles/dto/permissions.default';
import { otpEmailTemplate } from './templates/auth-otp-mail.template';
import { comparePasswords, hashPassword } from '../../helpers/password.helper';
import { OAuthUserProfileDto } from './dto/Oauth-user-profile.dto';
import { AuthMessages } from './constants/auth.messages';
import { AuthErrors } from './constants/auth.errors';
import { USER_UPLOAD_PATH } from '../../constants/upload_paths';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    private readonly otpService: OtpService,
    private readonly mailService: MailerService,
    private jwtService: JwtService,
    private roleService: RoleServices,
    private configService: ConfigService
  ) { }


  async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: {
        token: refreshToken,
        expiresAt: MoreThanOrEqual(new Date()),
      },
    });

    if (!token) throw new UnauthorizedException(AuthErrors.TOKEN_NOT_FOUND);

    await this.refreshTokenRepository.remove(token);

    return this.generateUserToken(token.userId);
  }



  async sendOtpMail(email: string) {
    const otp = await this.otpService.generateOtp(email);

    const message = otpEmailTemplate(otp.toString());

    await this.mailService.sendMail({
      from: this.configService.get("MAIL_FROM"),
      to: email,
      subject: this.configService.get('MAIL_SUBJECT_OTP'),
      html: message,
    });

    return { message: AuthMessages.OTP_FORWARDED_MESSAGE };
  }


  async forgotPassword(dto) {
    const { email } = dto;
    const user = await this.userRepository.findOne({ where: { email: email } })
    if (!user) throw new NotFoundException(AuthErrors.USER_NOT_EXIST)
    await this.sendOtpMail(email);

    return { message: AuthMessages.OTP_FORWARDED_MESSAGE };
  }

  async handleGoogleCallback(
    user: OAuthUserProfileDto & { role?: UserRole }
  ): Promise<string> {
    const result = await this.validateOAuthLogin(
      user,
      'google',
      user.role as UserRole,
    );

    return `${this.configService.get('FRONTEND_URL')}/otp?email=${encodeURIComponent(result.email)}`;
  }


  async verifyForgotPasswordOtp(dto) {
    const { email, otp } = dto;
    console.log({ email, otp })

    await this.otpService.verifyOtp(email, otp);
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) throw new UnauthorizedException(AuthErrors.USER_NOT_EXIST)


    const { accessToken } = await this.generateUserToken(email);

    return {
      message: 'OTP verified successfully',
      accessToken,
    };
  }

  async resetPassword(dto) {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({ where: { email } });
 
    if (!user) throw new UnauthorizedException(AuthErrors.USER_NOT_EXIST);

    const hashedPassword = await hashPassword(password, 10);

    await this.userRepository.update(
      { email },
      { password: hashedPassword }
    );

    return this.generateUserToken(user.id);
  }

  async changePassword(changePasswordDto, userId) {

    const { oldPassword, newPassword } = changePasswordDto;
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException(AuthErrors.USER_NOT_FOUND)

    const passwordMatch = await comparePasswords(oldPassword, user?.password);
    if (!passwordMatch) throw new UnauthorizedException(AuthErrors.OLD_PASSWORD_NOT_MATCHED);

    const newHashPassword = await hashPassword(newPassword, 10);

    user.password = newHashPassword;

    await this.userRepository.save(user);


    return { message: AuthMessages.PASSWORD_CHANGED_SUCCESS };

  }


  ///generate User Token
  async generateUserToken(userId) {
    const accessToken = this.jwtService.sign({ id: userId }, { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: this.configService.get<string>('JWT_EXPIRES') });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token: string, userId) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.refreshTokenRepository.save({ token, userId, expiresAt: expiryDate, })
  }

  async validateOAuthLogin(
    profile: OAuthUserProfileDto,
    provider: 'google' | 'twitter',
    role?: UserRole,
  ) {
    const email = profile.email?.verified ? profile.email.value : undefined;
    if (!email) throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND);

    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      const newRole = await this.roleService.createRole({
        role: role || UserRole.ATTENDEE,
        permissions: DefaultRolePermissions[role ?? UserRole.ATTENDEE],
      });
      const savedRole = await this.rolesRepository.save(newRole);

      user = this.userRepository.create({
        name: profile.displayName,
        email,
        provider,
        role: savedRole,
      });
      await this.userRepository.save(user);
    }

    await this.sendOtpMail(email);
    console.log()
    return { email: user.email };
  }



  ///Sign Up Function
  async signUp(signUpDto: SignUpDto, file?: Express.Multer.File) {
    const { name, email, password, role } = signUpDto;
    const imagePath = file ? `/${USER_UPLOAD_PATH}/${file.filename}` : undefined;

    // 1. Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException(AuthErrors.EMAIL_ALREADY_EXISTS);
    }
    const hashedPassword = await hashPassword(password, 10);

    const newRole = await this.roleService.createRole({
      role: role ?? UserRole.ATTENDEE,
      permissions: DefaultRolePermissions[role ?? UserRole.ATTENDEE],
    });

    const savedRole = await this.rolesRepository.save(newRole);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: savedRole,
      profileImg: imagePath,
    });
    await this.userRepository.save(user);

    return {
      message: AuthMessages.USER_SIGNED_UP
    };
  }


  ///Login Function
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email }
    })
    if (!user) throw new UnauthorizedException({ message: AuthErrors.INVALID_CREDENTIALS });

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException({ message: AuthErrors.INVALID_CREDENTIALS });

    await this.sendOtpMail(email);
    return {
      message: AuthMessages.USER_LOGGED_IN
    };
  }


  async verifyLoginOtp(verifyLoginDto) {
    const { email, otp } = verifyLoginDto;
    console.log(email, otp)
    await this.otpService.verifyOtp(email, otp);

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND);

    user.isVerified = true;
    await this.userRepository.save(user);

    const { accessToken} = await this.generateUserToken(user.id);
    return accessToken;
  }

  async getUserPermissions(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new BadRequestException(AuthErrors.USER_NOT_EXIST);

    const role = await this.roleService.getRoleById(user?.roleId)
    return role.role;
  }


}
