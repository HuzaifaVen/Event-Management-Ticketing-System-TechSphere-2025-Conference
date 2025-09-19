// notifications/notifications.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { Between } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthErrors } from 'src/auth/constants/auth.errors';
import * as dotenv from 'dotenv';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EventMessages } from 'src/events/constants/event.messages';

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
      private readonly configService: ConfigService
  ) {}

  // ✅ Run every day at 9 AM
 @Cron('0 9 * * *')
  async sendEventReminders() {
    this.logger.log('Running daily event reminder job...');

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

    if (!events.length) {
      this.logger.log(EventMessages.NO_EVENT_TOMORROW);
      return;
    }

    for (const event of events) {
      const tickets = await this.ticketRepo.find({where:{event:{id: event.id}}})

      for (const ticket of tickets) {
        if (ticket.notified) continue; 

        const user = await this.userRepo.findOne({where:{id:ticket.userId}})
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
    
    await this.mailService.sendMail({
      from: this.configService.get("MAIL_FROM"),
      to: email,
      subject: `Reminder: ${event.title} is happening tomorrow!`,
      text: `Hi, don't forget! ${event.title} starts at ${event.startDateTime.toLocaleString()}.`,
    });
  }
}
