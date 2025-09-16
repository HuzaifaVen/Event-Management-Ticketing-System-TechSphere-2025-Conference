import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Event } from './entities/event.entity';
import { Roles } from '../roles/entities/roles.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Pricing } from '../pricing/entities/pricing.entity';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event,Roles,User,Pricing]),
    AuthModule,
    PricingModule,
    UsersModule
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}
