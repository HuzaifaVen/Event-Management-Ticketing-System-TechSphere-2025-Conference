import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpService } from 'src/otp/otp.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly otpService: OtpService,
    private readonly mailService: MailerService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }


async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
        where: {
            token: refreshToken,
            expiresAt: MoreThanOrEqual(new Date()),
        },
    });

    if (!token) throw new UnauthorizedException("Token not found");

    await this.refreshTokenRepository.remove(token);
    console.log("token: ", token);

    return this.generateUserToken(token.userId);
}



async sendOtpMail(email: string) {
  const otp = this.otpService.generateOtp(email);

  const message = `
    <p>Forgot your password?</p>
    <p>Your OTP is: <b>${otp}</b></p>
    <p>If you didn’t request this, please ignore this email.</p>
  `;

  await this.mailService.sendMail({
    from: 'TechSphere Ev <techsphereEv@gmail.com>',
    to: email,
    subject: 'Your OTP Code',
    html: message,
  });

  return otp; // return OTP so you can save it in DB/Redis for verification
}


async forgotPassword(email){
  const user = await this.userRepository.findOne({where: {email: email}})
  if(!user) throw new NotFoundException("User doesnt exist on this email.")

  return user;
  
}

async changePassword(oldPassword,newPassword,userId){
  // const userId = req.userId;
  const user = await this.userRepository.findOne({where: {id: userId}})
  if(!user) throw new NotFoundException("User not found")

  const passwordMatch = await bcrypt.compare(oldPassword, user?.password);
  if(!passwordMatch) throw new UnauthorizedException("Old Password doesnt match");

  const newHashPassword = await bcrypt.hash(newPassword,10);

  user.password = newHashPassword;

  await this.userRepository.save(user);
  

  return {message: "password changed successfully"};
  // return true;

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

  ///Validating OAuth google 
  async validateOAuthLogin(profile: any, provider: 'google' | 'twitter') {
    const email = profile?.emails?.[0]?.value; // OAuth providers return emails
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = this.userRepository.create({
        name: profile.displayName || profile.username,
        email,
      });
      await this.userRepository.save(user);
    }

    const token = this.jwtService.sign(
      { id: user.id },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );

    return { user, token };
  }

  ///Sign Up Function
  async signUp(signUpDto: SignUpDto) {
    const { name, email, password, role } = signUpDto;

    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });

    if (existingUser) throw new BadRequestException("Email already exists");

    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name, email, password: hashPassword, role,
    })
    await this.userRepository.save(user);

    return await this.generateUserToken(user.id);
  }

  ///Login Function
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email }
    })
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid email or password');

    await this.sendOtpMail(email);
    // const token = await this.generateUserToken(user.id);
    return true;
    // return { token };
  }
  async verifyLoginOtp(email: string, otp: string) {
  // Verify OTP using OtpService
  await this.otpService.verifyOtp(email, otp);

  // OTP valid → generate JWT
  const user = await this.userRepository.findOne({ where: { email } });
  return this.generateUserToken(user?.id);
}


  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
