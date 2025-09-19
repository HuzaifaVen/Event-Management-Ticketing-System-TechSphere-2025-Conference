import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pricing } from './entities/pricing.entity';
import { PricingErrors } from './constants/pricing.errors';
import { PricingMessages } from './constants/pricing.messages';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(Pricing)
    private readonly pricingRepository: Repository<Pricing>
  ) {}

  async create(createPricingDto: CreatePricingDto) {
  const existing = await this.pricingRepository.findOne({ where: { tier: createPricingDto.tier } });
  if (existing) throw new BadRequestException(PricingErrors.PRICING_ALREADY_EXISTS);

  const pricing = this.pricingRepository.create(createPricingDto);
  await this.pricingRepository.save(pricing);

  return { message: PricingMessages.PRICING_CREATED_SUCESS };
}

}
