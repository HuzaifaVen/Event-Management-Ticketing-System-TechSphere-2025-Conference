import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingService } from './pricing.service';
import { Pricing } from './entities/pricing.entity';
import { BadRequestException } from '@nestjs/common';
import { PricingErrors } from './constants/pricing.errors';
import { PricingMessages } from './constants/pricing.messages';

describe('PricingService', () => {
  let service: PricingService;
  let pricingRepository: jest.Mocked<Repository<Pricing>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: getRepositoryToken(Pricing),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(), // ✅ Add findOne mock
          },
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    pricingRepository = module.get(getRepositoryToken(Pricing));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if pricing already exists', async () => {
      const dto = { tier: 'VIP', price: 100 } as any;
      pricingRepository.findOne.mockResolvedValue({ id: '1', ...dto } as Pricing);

      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException(PricingErrors.PRICING_ALREADY_EXISTS),
      );

      expect(pricingRepository.findOne).toHaveBeenCalledWith({
        where: { tier: dto.tier },
      });
      expect(pricingRepository.save).not.toHaveBeenCalled();
    });

    it('should save and return success message when pricing is new', async () => {
      const dto = { tier: 'VIP', price: 100 } as any;
      pricingRepository.findOne.mockResolvedValue(null); // simulate no existing pricing
      pricingRepository.create.mockReturnValue(dto as Pricing);
      pricingRepository.save.mockResolvedValue(dto as Pricing);

      const result = await service.create(dto);

      expect(result).toEqual({
        message: PricingMessages.PRICING_CREATED_SUCESS,
      });
      expect(pricingRepository.save).toHaveBeenCalledWith(dto);
    });
  });
});
