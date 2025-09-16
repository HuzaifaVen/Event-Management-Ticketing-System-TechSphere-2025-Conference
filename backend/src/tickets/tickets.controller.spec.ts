import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { AuthenticationGuard } from '../guards/auth.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { CanActivate, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ScanByQrDto } from './dto/scan-qrcode.dto';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  // ✅ Mock TicketsService
  const mockTicketsService = {
    create: jest.fn(),
    fetchTicketsByCategory: jest.fn(),
    scanTicket: jest.fn(),
    exportTickets: jest.fn(),
    deleteTicket: jest.fn(),
    fetchTickets: jest.fn(),
    findEvents: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
  const mockAuthorizationGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [{ provide: TicketsService, useValue: mockTicketsService }],
    })
      .overrideGuard(AuthenticationGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(AuthorizationGuard)
      .useValue(mockAuthorizationGuard)
      .compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto and userId', async () => {
      const dto: CreateTicketDto = { eventId: 'event123', pricingId: 'price123' } as any;
      const mockResult = { message: 'Ticket created', ticket: {} };
      mockTicketsService.create.mockResolvedValue(mockResult);

      const req = { userId: 'user123' };
      const result = await controller.create(dto, req);

      expect(service.create).toHaveBeenCalledWith(dto, 'user123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('fetchTicketsByCategory', () => {
    it('should return tickets for category', async () => {
      const mockResult = [{ ticketId: '1' }];
      mockTicketsService.fetchTicketsByCategory.mockResolvedValue(mockResult);

      const result = await controller.fetchTicketsByCategory('event123');
      expect(service.fetchTicketsByCategory).toHaveBeenCalledWith('event123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('scan', () => {
    it('should scan a ticket by QR code', async () => {
      const dto: ScanByQrDto = { qrCode: 'qrcode123' };
      const mockResult = { message: 'Ticket scanned' };
      mockTicketsService.scanTicket.mockResolvedValue(mockResult);

      const result = await controller.scan(dto);
      expect(service.scanTicket).toHaveBeenCalledWith('qrcode123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('exportTickets', () => {
    it('should call exportTickets with userId and res', async () => {
      const res = { setHeader: jest.fn().mockReturnThis(), status: jest.fn().mockReturnThis(), send: jest.fn() };
      const req = { userId: 'user123' };

      await controller.exportTickets(req, res);
      expect(service.exportTickets).toHaveBeenCalledWith('user123', res);
    });

    it('should return 401 if no userId', async () => {
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const req = {}; // no userId

      await controller.exportTickets(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Unauthorized');
    });
  });

  describe('delete', () => {
    it('should call service.deleteTicket', async () => {
      const mockResult = { message: 'deleted' };
      mockTicketsService.deleteTicket.mockResolvedValue(mockResult);

      const result = await controller.delete('ticket123');
      expect(service.deleteTicket).toHaveBeenCalledWith('ticket123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('fetchTickets', () => {
    it('should fetch tickets for user', async () => {
      const mockResult = [{ ticketId: '1' }];
      mockTicketsService.fetchTickets.mockResolvedValue(mockResult);

      const req = { userId: 'user123' };
      const result = await controller.fetchTickets(req);
      expect(service.fetchTickets).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('findEvents', () => {
    it('should find events by eventId', async () => {
      const mockResult = [{ id: 'event123' }];
      mockTicketsService.findEvents.mockResolvedValue(mockResult);

      const result = await controller.findEvents('event123');
      expect(service.findEvents).toHaveBeenCalledWith('event123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should call service.remove with numeric id', async () => {
      mockTicketsService.remove.mockResolvedValue({ message: 'removed' });

      await controller.remove('42');
      expect(service.remove).toHaveBeenCalledWith(42);
    });
  });
});
