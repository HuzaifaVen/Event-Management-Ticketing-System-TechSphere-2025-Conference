import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { Event } from '../events/entities/event.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(), // 👈 enables scheduling
    TypeOrmModule.forFeature([Event, Ticket,User]), // 👈 so ReminderService can query them
  ],
  controllers: [ReminderController],
  providers: [ReminderService],
})
export class ReminderModule {}
