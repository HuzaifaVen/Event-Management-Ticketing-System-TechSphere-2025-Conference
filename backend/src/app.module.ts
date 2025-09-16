import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { OtpModule } from './otp/otp.module';
import { OtpRequest } from './otp/entities/otp.entity';
import { Roles } from './roles/entities/roles.entity';
import { RoleModule } from './roles/roles.module';
import { EventsModule } from './events/events.module';
import { Event } from './events/entities/event.entity';
import { PricingModule } from './pricing/pricing.module';
import { Pricing } from './pricing/entities/pricing.entity';
import { TicketsModule } from './tickets/tickets.module';
import { Ticket } from './tickets/entities/ticket.entity';
import { StripeModule } from './stripe/stripe.module';
import { ReminderModule } from './reminder/reminder.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import {diskStorage} from "multer";
import { extname, join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule.forRootAsync(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User,RefreshToken,OtpRequest,Roles,Event,Pricing,Ticket],
        synchronize: true, // only for development
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
      }
    }),
    MulterModule.register({
          storage: diskStorage({
            destination: join(process.cwd(), 'uploads'), 
            filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
              const ext = extname(file.originalname);
              cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); 
            },
          }),
          // Optional: Add file filters for image types
          fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
              return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
          },
          limits: {
            fileSize: 1024 * 1024 * 5,
          },
    }),
    AuthModule,
    UsersModule,
    OtpModule,
    RoleModule,
    EventsModule,
    PricingModule,
    TicketsModule,
    StripeModule,
    ReminderModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
