import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthenticationGuard } from '../guards/auth.guard';
import { OtpModule } from 'src/otp/otp.module';
import { RoleModule } from '../roles/roles.module';
import { Roles } from 'src/roles/entities/roles.entity';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User,RefreshToken,Roles]),
    RoleModule,
    OtpModule
  ],
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategy,AuthenticationGuard],
  exports: [AuthService],
})
export class AuthModule {}
