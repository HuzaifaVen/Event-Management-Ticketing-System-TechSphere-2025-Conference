import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundError } from 'rxjs';
import { Pricing } from '../pricing/entities/pricing.entity';
import { PricingService } from '../pricing/pricing.service';
import { EventErrors } from './constants/event.errors';
import { AuthErrors } from '../auth/constants/auth.errors';
import { EventMessages } from './constants/event.messages';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pricing)
    private readonly pricingRepository: Repository<Pricing>
  ) { }

  async create(createEventDto: CreateEventDto, userId: string) {
    const existingEvent = await this.eventRepository.findOne({ where: { title: createEventDto.title } });
    if (existingEvent) throw new BadRequestException(EventErrors.EVENT_EXISTS);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException(AuthErrors.USER_NOT_FOUND);

    try {
      // attach userId and optionally pricings
      const event = this.eventRepository.create({
        ...createEventDto,
        userId: user.id
      });

      // save both event and pricings at once
      await this.eventRepository.save(event);

      return event;
    } catch (e) {

      throw new BadRequestException(EventErrors.FAILED_EVENT_CREATION);
    }
  }


  async findAllById(id: string | undefined, query) {
    const {userId, page, limit, filters } = query;

    let where: any = {};

    if (userId || filters?.location || filters?.pricing) {
      if (userId) where.userId = userId;
      else where.userId = id;
      if (filters?.location) where.location = filters.location;
      if (filters?.pricing) where.pricing = filters.pricing;
    } else {
      where = undefined; 
    }

    const [events, total] = await this.eventRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
    })
    if (!events) throw new NotFoundException()

    return { events, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findAll(options: { page: number, limit: number, filters: any }) {
    const { page, limit, filters } = options;


    let where: any = {};

    if (filters?.location || filters?.pricing) {
      
      if (filters?.location) where.location = filters.location;
      if (filters?.pricing) where.pricing = filters.pricing;
    } else {
      where = undefined; 
    }
    const [events, total] = await this.eventRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
    })
    if (!events) throw new NotFoundException()

    return { events, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } })
    if (!event) throw new NotFoundException(EventErrors.EVENT_NOT_FOUND);
    return { event }
  }

 async update(id: string, updateEventDto: any) {
  const event = await this.eventRepository.findOne({
    where: { id },
    relations: ['pricings'],
  });

  if (!event) throw new NotFoundException(EventErrors.EVENT_NOT_FOUND);

  // 1. Update event fields
  const { pricings, ...eventFields } = updateEventDto;
  Object.assign(event, eventFields);
  await this.eventRepository.save(event);

  if (pricings) {
    const existingPricings = event.pricings;

    const incomingTiers = pricings.map(p => p.tier);

    const toDelete = existingPricings.filter(p => !incomingTiers.includes(p.tier));
    if (toDelete.length > 0) {
      await this.pricingRepository.remove(toDelete);
    }

    // 2️⃣ UPSERT pricings by tier
    for (const p of pricings) {
      const existing = existingPricings.find(ep => ep.tier === p.tier);

      if (existing) {
        await this.pricingRepository.update(existing.id, {
          ...p,
          eventId: id,
        });
      } else {
        await this.pricingRepository.insert({
          ...p,
          eventId: id,
        });
      }
    }
  }

  return { message: EventMessages.EVENT_UPDATED_SUCCESSFULLY };
}




  async remove(id: string, userId: string) {
    const deleteUser = await this.eventRepository.delete({ userId, id })
    if (!deleteUser.affected || deleteUser.affected === 0) {
      throw new BadRequestException(EventErrors.EVENT_NOT_EXIST);
    }
    return {message: EventMessages.EVENT_UPDATED_SUCCESSFULLY}
  }
}
