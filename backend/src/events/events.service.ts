import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundError } from 'rxjs';
import { Pricing } from 'src/pricing/entities/pricing.entity';
import { PricingService } from 'src/pricing/pricing.service';
import { EventErrors } from './constants/event.errors';
import { AuthErrors } from 'src/auth/constants/auth.errors';
import { EventMessages } from './constants/event.messages';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pricing)
    private readonly pricingRepository: Repository<Pricing>,
    private readonly pricingService: PricingService
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
      console.error("Error creating event:", e);
      throw new BadRequestException(EventErrors.FAILED_EVENT_CREATION);
    }
  }


  async findAll(userId: string, options: { page: number, limit: number, filters: any }) {
    const { page, limit, filters } = options;

    const where: any = { userId };

    if (filters.location) where.location = filters.location;
    if (filters.pricing) where.pricing = filters.pricing

    console.log("page: ", page)
    const [events, total] = await this.eventRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
    })
    if (!events) throw new NotFoundException()

    return { events, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string, userId: string) {
    const event = await this.eventRepository.findOne({ where: { userId, id } })
    if (!event) throw new NotFoundException(EventErrors.EVENT_NOT_FOUND);

    return { event }
  }

  async update(id: string, updateEventDto: any) {
  const event = await this.eventRepository.findOneBy({ id });
  if (!event) throw new NotFoundException(EventErrors.EVENT_NOT_FOUND);

  // 1. Update event scalar fields
  const { pricings, ...eventFields } = updateEventDto;
  Object.assign(event, eventFields);
  await this.eventRepository.save(event);

  // 2. Update pricings if provided
  if (pricings) {
    for (const p of pricings) {
      if (p.id) {
        // update existing pricing
        await this.pricingRepository.update(p.id, {
          ...p,
          eventId: id, // keep relation intact
        });
      } else {
        // insert new pricing
        await this.pricingRepository.insert({
          ...p,
          eventId: id,
        });
      }
    }
  }

  return { message: EventMessages.EVENT_UPDATED_SUCCESSFULLY};
}



  async remove(id: string, userId: string) {
    const deleteUser = await this.eventRepository.delete({ userId, id })
    console.log("delete User: ", deleteUser)
    if (!deleteUser.affected || deleteUser.affected === 0) {
      throw new BadRequestException(EventErrors.EVENT_NOT_EXIST);
    }
  }
}
