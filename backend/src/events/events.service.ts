import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import { Pricing } from 'src/pricing/entities/pricing.entity';
import { PricingService } from 'src/pricing/pricing.service';
import { EventErrors } from './constants/event.errors';
import { AuthErrors } from '../auth/constants/auth.errors';
import { EventMessages } from './constants/event.messages';
import { FindOptionsWhere } from 'typeorm';
import { EVENT_UPLOAD_PATH } from '../../constants/upload_paths';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pricing)
    private readonly pricingRepository: Repository<Pricing>,
  ) { }

  async create(createEventDto: CreateEventDto, userId: string,file?:Express.Multer.File) {
    const existingEvent = await this.eventRepository.findOne({ where: { title: createEventDto.title } });

    if (existingEvent) throw new BadRequestException(EventErrors.EVENT_EXISTS);
    const imagePath = file ? `/${EVENT_UPLOAD_PATH}/${file.filename}` : undefined;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException(AuthErrors.USER_NOT_FOUND);

    try {
      const event = this.eventRepository.create({
        ...createEventDto,
        image: imagePath,
        userId: user.id
      });

      await this.eventRepository.save(event);

      return event;
    } catch (e) {

      throw new BadRequestException(EventErrors.FAILED_EVENT_CREATION);
    }
  }


  async findAllById(id: string | undefined, query) {
    const { userId, page, limit, location, pricing } = query;

    const where: FindOptionsWhere<Event> = {
      ...(userId || id ? { userId: userId ?? id } : {}),
      ...(location ? { location } : {}),
      ...(pricing ? { pricing } : {}),
    };

    const [events, total] = await this.eventRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
    })
    if (!events) throw new NotFoundException(EventErrors.EVENT_NOT_FOUND)

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
    if (!deleteUser.affected) {
      throw new BadRequestException(EventErrors.EVENT_NOT_EXIST);
    }
    return { message: EventMessages.EVENT_UPDATED_SUCCESSFULLY }
  }
}
