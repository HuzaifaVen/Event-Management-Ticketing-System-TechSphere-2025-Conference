import { Test, TestingModule } from '@nestjs/testing';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';

describe('ReminderController', () => {
  let controller: ReminderController;
  let service: ReminderService;

  const mockReminderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderController],
      providers: [
        {
          provide: ReminderService,
          useValue: mockReminderService, 
        },
      ],
    }).compile();

    controller = module.get<ReminderController>(ReminderController);
    service = module.get<ReminderService>(ReminderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
