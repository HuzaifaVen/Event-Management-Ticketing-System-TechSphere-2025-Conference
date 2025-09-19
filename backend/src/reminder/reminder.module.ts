import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderService } from './reminder.service';
import { Event } from 'src/events/entities/event.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    TypeOrmModule.forFeature([Event, Ticket,User]), 
  ],
  providers: [ReminderService],
})
export class ReminderModule {}
