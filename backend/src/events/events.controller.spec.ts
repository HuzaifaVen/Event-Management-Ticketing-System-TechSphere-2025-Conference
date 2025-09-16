import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AuthenticationGuard } from '../guards/auth.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { AuthService } from '../auth/auth.service';
import { Event } from './entities/event.entity';

describe('EventsController', () => {
  let controller: EventsController;
  let eventService: jest.Mocked<EventsService>;

  const mockEvent: Event = {
  id: '1',
  userId: 'user-123',
  title: 'Sample Event',
  description: 'This is a sample event',
  startDateTime: new Date(),
  endDateTime: new Date(),
  location: 'NYC',
  tickets: [],
  // createdAt: new Date(),
  // updatedAt: new Date(),
  // if you have relations like user/pricings, mock them as empty arrays or null
  user: {} as any,
  pricings: [],
};

  const mockEventServices = {
    create: jest.fn(),
    findAllById: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        { provide: EventsService, useValue: mockEventServices },
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(AuthenticationGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AuthorizationGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<EventsController>(EventsController);
    eventService = module.get(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call eventsService.create with correct params', async () => {
      const dto = { title: 'Event 1', location: 'NYC' } as any;
      const req = { userId: 'user-123' };
      const mockResult = { id: 'event-1', ...dto };

      eventService.create.mockResolvedValue(mockEvent);

      const result = await controller.create(dto, req);

      expect(eventService.create).toHaveBeenCalledWith(dto, req.userId);
      expect(result).toBe(mockEvent);
    });
  });

  describe('findAllId', () => {
    it('should call eventsService.findAllById with userId and query', async () => {
      const req = { userId: 'user-123' };
      const query = { page: 1, limit: 10 };
      const mockResult = { events: [], total: 0 };

      eventService.findAllById.mockResolvedValue(mockEvent);

      const result = await controller.findAllId(req, query);

      expect(eventService.findAllById).toHaveBeenCalledWith(req.userId, query);
      expect(result).toBe(mockEvent);
    });
  });

  describe('findOne', () => {
    it('should call eventsService.findOne with correct id', async () => {
      const eventId = 'event-1';
      const mockResult = { event: { id: eventId} };

      eventService.findOne.mockResolvedValue(mockEvent);

      const result = await controller.findOne(eventId);

      expect(eventService.findOne).toHaveBeenCalledWith(eventId);
      expect(result).toBe(mockEvent);
    });
  });

  describe('update', () => {
    it('should call eventsService.update with correct params', async () => {
      const eventId = 'event-1';
      const dto = { title: 'Updated Title' } as any;
      const mockResult = { message: 'Event updated successfully' };

      eventService.update.mockResolvedValue(mockResult);

      const result = await controller.update(eventId, dto);

      expect(eventService.update).toHaveBeenCalledWith(eventId, dto);
      expect(result).toBe(mockResult);
    });
  });

  describe('delete', () => {
    it('should call eventsService.remove with correct params', async () => {
      const eventId = 'event-1';
      const req = { userId: 'user-123' };
      const mockResult = { message: 'Event deleted successfully' };

      eventService.remove.mockResolvedValue(mockResult);

      const result = await controller.delete(eventId, req);

      expect(eventService.remove).toHaveBeenCalledWith(eventId, req.userId);
      expect(result).toBe(mockResult);
    });
  });
});
