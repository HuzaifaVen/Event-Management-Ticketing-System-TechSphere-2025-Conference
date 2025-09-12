// notifications/notifications.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import * as nodemailer from 'nodemailer';
import { Between } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundError } from 'rxjs';
import { AuthErrors } from 'src/auth/constants/auth.errors';
import * as dotenv from 'dotenv';
import { MailerService } from '@nestjs-modules/mailer';

dotenv.config();
@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(User)
  private readonly userRepo: Repository<User>, 
      private readonly mailService: MailerService,
  ) {}

  // ✅ Run every day at 9 AM
 @Cron('0 9 * * *')
  async sendEventReminders() {
    this.logger.log('Running daily event reminder job...');
    console.log("running")
    // tomorrow's date range
    const tomorrow = addDays(new Date(), 1);
    const from = startOfDay(tomorrow);
    const to = endOfDay(tomorrow);

    // find events starting tomorrow
    const events = await this.eventRepo.find({
      where: {
        startDateTime: Between(from, to),
      },
      relations: ['tickets'],
    });
    console.log("event: ",events)

    if (!events.length) {
      this.logger.log('No events found for tomorrow.');
      return;
    }

    for (const event of events) {
      const tickets = await this.ticketRepo.find({where:{event:{id: event.id}}})
      console.log(tickets)
      for (const ticket of tickets) {
        if (ticket.notified) continue; // already notified

        const user = await this.userRepo.findOne({where:{id:ticket.userId}})
        console.log("user: ",user?.id)
        if(!user) throw new NotFoundException(AuthErrors.USER_NOT_FOUND);

        await this.sendEmail(user.email, event);

        ticket.notified = true;
        await this.ticketRepo.save(ticket);

        this.logger.log(
          `Reminder sent to ${user.email} for event ${event.title}`,
        );
      }
    }
  }

  private async sendEmail(email: string, event: Event) {
    console.log("sending email: ",email)
    
    await this.mailService.sendMail({
      from: '"Event Reminder" <no-reply@yourapp.com>',
      to: email,
      subject: `Reminder: ${event.title} is happening tomorrow!`,
      text: `Hi, don't forget! ${event.title} starts at ${event.startDateTime.toLocaleString()}.`,
    });
  }
}
