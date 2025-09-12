import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
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
    const pricing = await this.pricingRepository.create(createPricingDto)
    if(pricing) throw new BadRequestException(PricingErrors.PRICING_ALREADY_EXISTS);

    await this.pricingRepository.save(pricing)

    return {message: PricingMessages.PRICING_CREATED_SUCESS}
  }

  // findAll() {
  //   return `This action returns all pricing`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} pricing`;
  // }

  update(id: string, updatePricingDto: UpdatePricingDto) {
    return `This action updates a #${id} pricing`;
  }

  remove(id: number) {
    return `This action removes a #${id} pricing`;
  }
}
