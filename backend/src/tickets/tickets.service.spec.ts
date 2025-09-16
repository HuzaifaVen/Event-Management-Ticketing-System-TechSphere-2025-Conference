import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../events/entities/event.entity';
import { Ticket } from './entities/ticket.entity';
import { Pricing } from '../pricing/entities/pricing.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TicketErrors } from './constants/ticket.errors';
import { TicketMessages } from './constants/ticket.messages';
import { EventErrors } from '../events/constants/event.errors';

describe('TicketsService', () => {
  let service: TicketsService;
  let eventRepo: any;
  let ticketRepo: any;
  let pricingRepo: any;
  let userRepo: any;

  beforeEach(async () => {
    const mockRepository = () => ({
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: getRepositoryToken(Event), useFactory: mockRepository },
        { provide: getRepositoryToken(Ticket), useFactory: mockRepository },
        { provide: getRepositoryToken(Pricing), useFactory: mockRepository },
        { provide: getRepositoryToken(User), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    eventRepo = module.get(getRepositoryToken(Event));
    ticketRepo = module.get(getRepositoryToken(Ticket));
    pricingRepo = module.get(getRepositoryToken(Pricing));
    userRepo = module.get(getRepositoryToken(User));
  });

  describe('fetchTickets', () => {
    it('should throw NotFoundException if no events', async () => {
      eventRepo.find.mockResolvedValue([]);
      await expect(service.fetchTickets('user_1')).rejects.toThrow(NotFoundException);
    });

    it('should return mapped tickets', async () => {
      eventRepo.find.mockResolvedValue([{ id: 'e1', userId: 'user_1' }]);
      ticketRepo.find.mockResolvedValue([
        { id: 't1', userId: 'user_1', event: { title: 'Event A' }, pricingId: 'p1', isUsed: false, qrCode: 'qr1' },
      ]);
      const result = await service.fetchTickets('user_1');
      expect(result).toEqual([
        expect.objectContaining({ ticketId: 't1', eventName: 'Event A', pricingId: 'p1' }),
      ]);
    });
  });

  describe('exportTickets', () => {
    it('should call fetchTickets and send CSV', async () => {
      jest.spyOn(service, 'fetchTickets').mockResolvedValue([
        { ticketId: 't1', userId: 'u1', eventName: 'E1', pricingId: 'p1' },
      ]);
      const res = {
        setHeader: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await service.exportTickets('user_1', res as any);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.stringContaining('ticketId,userId,eventName,pricingId'));
    });
  });

  describe('fetchTicketsByCategory', () => {
    it('should return categorized tickets', async () => {
      ticketRepo.find.mockResolvedValue([{ pricingId: 'p1', userId: 'u1' }]);
      pricingRepo.findOne.mockResolvedValue({ id: 'p1', tier: 'VIP' });
      const result = await service.fetchTicketsByCategory('event_1');
      expect(result).toHaveProperty('VIP');
      expect(result.VIP.count).toBe(1);
    });

    it('should throw NotFoundException if no tickets', async () => {
      ticketRepo.find.mockResolvedValue(undefined);
      await expect(service.fetchTicketsByCategory('e1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should throw if event does not exist', async () => {
      eventRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ eventId: 'e1' } as any, 'u1')).rejects.toThrow(NotFoundException);
    });

    it('should throw if ticket already exists', async () => {
      eventRepo.findOne.mockResolvedValue({ id: 'e1' });
      ticketRepo.findOne.mockResolvedValue({ id: 'existing_ticket' });
      await expect(service.create({ eventId: 'e1' } as any, 'u1')).rejects.toThrow(BadRequestException);
    });

    it('should create and save ticket', async () => {
      eventRepo.findOne.mockResolvedValue({ id: 'e1' });
      ticketRepo.findOne.mockResolvedValue(null);
      ticketRepo.create.mockReturnValue({ pricingId: 'p1' });
      pricingRepo.findOne.mockResolvedValue({ id: 'p1', soldTickets: 0 });
      ticketRepo.save.mockResolvedValue({ id: 't1' });

      const result = await service.create({ eventId: 'e1' } as any, 'u1');
      expect(ticketRepo.create).toHaveBeenCalled();
      expect(pricingRepo.save).toHaveBeenCalledWith(expect.objectContaining({ soldTickets: 1 }));
      expect(result.ticket).toEqual({ id: 't1' });
    });
  });

  describe('findEvents', () => {
    it('should throw if no events found', async () => {
      ticketRepo.find.mockResolvedValue([]);
      await expect(service.findEvents('e1')).rejects.toThrow(NotFoundException);
    });

    it('should return events', async () => {
      ticketRepo.find.mockResolvedValue([{ id: 't1' }]);
      const result = await service.findEvents('e1');
      expect(result.allEvents).toHaveLength(1);
    });
  });

  describe('deleteTicket', () => {
    it('should throw if delete fails', async () => {
      ticketRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.deleteTicket('t1')).rejects.toThrow(BadRequestException);
    });

    it('should return success message if deleted', async () => {
      ticketRepo.delete.mockResolvedValue({ affected: 1 });
      const result = await service.deleteTicket('t1');
      expect(result).toEqual({ message: TicketMessages.TICKET_DELETED });
    });
  });

  describe('scanTicket', () => {
    it('should throw if ticket not found', async () => {
      ticketRepo.findOne.mockResolvedValue(null);
      await expect(service.scanTicket('qr1')).rejects.toThrow(NotFoundException);
    });

    it('should throw if ticket already used', async () => {
      ticketRepo.findOne.mockResolvedValue({ isUsed: true });
      await expect(service.scanTicket('qr1')).rejects.toThrow(BadRequestException);
    });

    it('should mark ticket as used and save', async () => {
      const mockTicket = { isUsed: false };
      ticketRepo.findOne.mockResolvedValue(mockTicket);
      ticketRepo.save.mockResolvedValue({ ...mockTicket, isUsed: true });

      const result = await service.scanTicket('qr1');
      expect(mockTicket.isUsed).toBe(true);
      expect(ticketRepo.save).toHaveBeenCalledWith(mockTicket);
      expect(result).toHaveProperty('message', TicketMessages.TICKET_APPROVED);
    });
  });
});
