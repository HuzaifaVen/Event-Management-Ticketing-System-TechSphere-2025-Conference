import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { User } from '../users/entities/user.entity';
import { Pricing } from '../pricing/entities/pricing.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventErrors } from './constants/event.errors';
import { AuthErrors } from '../auth/constants/auth.errors';
import { EventMessages } from './constants/event.messages';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: any;
  let userRepository: any;
  let pricingRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Pricing),
          useValue: { remove: jest.fn(), update: jest.fn(), insert: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get(getRepositoryToken(Event));
    userRepository = module.get(getRepositoryToken(User));
    pricingRepository = module.get(getRepositoryToken(Pricing));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if event with same title exists', async () => {
      eventRepository.findOne.mockResolvedValue({ id: 1 });
      await expect(service.create({ title: 'Test Event' } as any, 'user1')).rejects.toThrow(
        new BadRequestException(EventErrors.EVENT_EXISTS),
      );
    });

    it('should throw if user does not exist', async () => {
      eventRepository.findOne.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.create({ title: 'Test Event' } as any, 'user1')).rejects.toThrow(
        new BadRequestException(AuthErrors.USER_NOT_FOUND),
      );
    });

    it('should create and return event', async () => {
      const mockEvent = { id: 1, title: 'New Event' };
      eventRepository.findOne.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue({ id: 'user1' });
      eventRepository.create.mockReturnValue(mockEvent);
      eventRepository.save.mockResolvedValue(mockEvent);

      const result = await service.create({ title: 'New Event' } as any, 'user1');
      expect(result).toEqual(mockEvent);
      expect(eventRepository.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Event', userId: 'user1' }));
      expect(eventRepository.save).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('findAllById', () => {
    it('should return events with pagination', async () => {
      eventRepository.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);
      const result = await service.findAllById('user1', { page: 1, limit: 10, filters: {} });
      expect(result.total).toBe(1);
      expect(result.events).toHaveLength(1);
    });

    it('should throw if no events found', async () => {
      eventRepository.findAndCount.mockResolvedValue([null, 0]);
      await expect(service.findAllById('user1', { page: 1, limit: 10, filters: {} })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return events with pagination', async () => {
      eventRepository.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);
      const result = await service.findAll({ page: 1, limit: 10, filters: {} });
      expect(result.total).toBe(1);
    });

    it('should throw if no events found', async () => {
      eventRepository.findAndCount.mockResolvedValue([null, 0]);
      await expect(service.findAll({ page: 1, limit: 10, filters: {} })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should throw if event not found', async () => {
      eventRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('123')).rejects.toThrow(
        new NotFoundException(EventErrors.EVENT_NOT_FOUND),
      );
    });

    it('should return event if found', async () => {
      eventRepository.findOne.mockResolvedValue({ id: '123', title: 'Test Event' });
      const result = await service.findOne('123');
      expect(result.event).toEqual({ id: '123', title: 'Test Event' });
    });
  });

  describe('update', () => {
    it('should throw if event not found', async () => {
      eventRepository.findOne.mockResolvedValue(null);
      await expect(service.update('123', {})).rejects.toThrow(
        new NotFoundException(EventErrors.EVENT_NOT_FOUND),
      );
    });

    it('should update event and pricings', async () => {
      const mockEvent = { id: '123', pricings: [{ id: 1, tier: 'gold' }] };
      eventRepository.findOne.mockResolvedValue(mockEvent);
      eventRepository.save.mockResolvedValue(mockEvent);
      pricingRepository.remove.mockResolvedValue({});
      pricingRepository.update.mockResolvedValue({});
      pricingRepository.insert.mockResolvedValue({});

      const result = await service.update('123', {
        title: 'Updated Event',
        pricings: [{ tier: 'silver', price: 100 }],
      });

      expect(result.message).toBe(EventMessages.EVENT_UPDATED_SUCCESSFULLY);
      expect(eventRepository.save).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Event' }));
      expect(pricingRepository.remove).toHaveBeenCalled();
      expect(pricingRepository.insert).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should throw if no rows affected', async () => {
      eventRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('123', 'user1')).rejects.toThrow(
        new BadRequestException(EventErrors.EVENT_NOT_EXIST),
      );
    });

    it('should delete and return success message', async () => {
      eventRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove('123', 'user1');
      expect(result.message).toBe(EventMessages.EVENT_UPDATED_SUCCESSFULLY);
    });
  });
});
