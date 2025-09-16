import { Test, TestingModule } from '@nestjs/testing';
import { ReminderService } from './reminder.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../events/entities/event.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { addDays, startOfDay, endOfDay } from 'date-fns';

describe('ReminderService', () => {
  let service: ReminderService;
  let eventRepo: jest.Mocked<Repository<Event>>;
  let ticketRepo: jest.Mocked<Repository<Ticket>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let mailService: jest.Mocked<MailerService>;

  beforeEach(async () => {
    eventRepo = {
      find: jest.fn(),
    } as any;

    ticketRepo = {
      find: jest.fn(),
      save: jest.fn(),
    } as any;

    userRepo = {
      findOne: jest.fn(),
    } as any;

    mailService = {
      sendMail: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReminderService,
        { provide: getRepositoryToken(Event), useValue: eventRepo },
        { provide: getRepositoryToken(Ticket), useValue: ticketRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: MailerService, useValue: mailService },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('noreply@example.com') } },
      ],
    }).compile();

    service = module.get<ReminderService>(ReminderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log and return if no events are found', async () => {
    eventRepo.find.mockResolvedValue([]);
    await service.sendEventReminders();

    expect(eventRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          startDateTime: expect.any(Object), // Between(...) object
        }),
      }),
    );
    expect(ticketRepo.find).not.toHaveBeenCalled();
    expect(mailService.sendMail).not.toHaveBeenCalled();
  });

  it('should send email and mark tickets as notified', async () => {
    const tomorrow = addDays(new Date(), 1);
    const mockEvent: Event = {
      id: 1,
      title: 'Sample Event',
      startDateTime: tomorrow,
      tickets: [],
    } as any;

    const mockTicket: Ticket = { id: 10, userId: 5, notified: false } as any;
    const mockUser: User = { id: 5, email: 'test@example.com' } as any;

    eventRepo.find.mockResolvedValue([mockEvent]);
    ticketRepo.find.mockResolvedValue([mockTicket]);
    userRepo.findOne.mockResolvedValue(mockUser);

    await service.sendEventReminders();

    expect(mailService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: expect.stringContaining('Sample Event'),
      }),
    );

    expect(ticketRepo.save).toHaveBeenCalledWith(expect.objectContaining({ notified: true }));
  });

  it('should throw NotFoundException if user not found', async () => {
    const tomorrow = addDays(new Date(), 1);
    eventRepo.find.mockResolvedValue([{ id: 1, title: 'Event', startDateTime: tomorrow, tickets: [] } as any]);
    ticketRepo.find.mockResolvedValue([{ id: 1, userId: 99, notified: false } as any]);
    userRepo.findOne.mockResolvedValue(null);

    await expect(service.sendEventReminders()).rejects.toThrow(NotFoundException);
    expect(mailService.sendMail).not.toHaveBeenCalled();
  });
});
