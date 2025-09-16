import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { Pricing } from '../pricing/entities/pricing.entity';
import { PricingModule } from '../pricing/pricing.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket,Event,Pricing,User]),
  PricingModule,
  UsersModule,
  EventsModule,
  AuthModule
],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService]
})
export class TicketsModule {}
