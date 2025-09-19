import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../events/entities/event.entity';
import { TicketErrors } from './constants/ticket.errors';
import { TicketMessages } from './constants/ticket.messages';
<<<<<<< HEAD
import { User } from '../users/entities/user.entity';
import { Pricing } from '../pricing/entities/pricing.entity';
import { Parser } from 'json2csv';
import { Response } from 'express';
import { EventErrors } from '../events/constants/event.errors';
=======
import { User } from 'src/users/entities/user.entity';
import { Pricing } from 'src/pricing/entities/pricing.entity';
import { EventErrors } from 'src/events/constants/event.errors';
>>>>>>> ac44b6d7b15ae1e86bae229d45c3aabb71f96157

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Pricing)
    private readonly pricingRepository: Repository<Pricing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async fetchTickets(userId: string) {
    // Get all events organized by this user
    const events = await this.eventRepository.find({ where: { userId } });
    if (!events.length) throw new NotFoundException(TicketErrors.NO_TICKETS_FOUND);

    let allTickets: any = [];

    for (const event of events) {
      const tickets = await this.ticketRepository.find({
        where: { event: { id: event.id } },
<<<<<<< HEAD
        relations: ['event'], 
=======
        relations: ['event'],
>>>>>>> ac44b6d7b15ae1e86bae229d45c3aabb71f96157
      });

      if (!tickets.length) continue;


      const mappedTickets = tickets.map((ticket) => ({
        ticketId: ticket.id,
        userId: ticket.userId,
        eventName: ticket.event.title,
        pricingId: ticket.pricingId,
        isUsed: ticket.isUsed,
        qrCode: ticket.qrCode,
      }));

      allTickets.push(...mappedTickets); 
    }

    // Optional: sort by ticket creation date or id
    allTickets.sort((a, b) => (a.ticketId > b.ticketId ? -1 : 1));

    return allTickets;
  }
  async exportTickets(userId: string) {
    const tickets = await this.fetchTickets(userId);

    // CSV header
    const header = 'ticketId,userId,eventName,pricingId';

    // CSV body
    const csvRows = tickets.map(
      t => `${t.ticketId},${t.userId},${t.eventName},${t.pricingId}`
    );

    const csv = [header, ...csvRows].join('\n');

    return {
      filename: "tickets.csv",
      data: csv
    }

  }

  async fetchTicketsByCategory(evenId: string) {
    const tickets = await this.ticketRepository.find({ where: { eventId: evenId } })
    if (!tickets) throw new NotFoundException(TicketErrors.NO_TICKETS_FOUND)

    const categorized = {};

    for (const ticket of tickets) {
      const pricing = await this.pricingRepository.findOne({
        where: { id: ticket.pricingId },
      });

      if (!pricing) continue; 

      const tier = pricing.tier; 

      if (!categorized[tier]) {
        categorized[tier] = { users: [], count: 0 };
      }

      categorized[tier].users.push(ticket.userId);
      categorized[tier].count += 1;
    }

<<<<<<< HEAD
    return categorized;
=======
    return {message: TicketMessages
      ,categorized: categorized};
>>>>>>> ac44b6d7b15ae1e86bae229d45c3aabb71f96157
  }

  async create(createTicketDto: CreateTicketDto, userId: any) {
    const { eventId } = createTicketDto;
<<<<<<< HEAD
    const event = await this.eventRepository.findOne({where:{id:eventId}})
    if(!event) throw new NotFoundException(EventErrors.EVENT_NOT_EXIST)
=======
    const event = this.eventRepository.findOne({ where: { id: eventId } })
    if (!event) throw new NotFoundException(EventErrors.EVENT_NOT_EXIST)
>>>>>>> ac44b6d7b15ae1e86bae229d45c3aabb71f96157

    const existingTicket = await this.ticketRepository.findOne({
      where: { event: { id: eventId }, userId },
    });

    if (existingTicket) throw new BadRequestException(TicketErrors.ALREADY_BOOKED);

    const qrPayload = uuidv4();

    const ticket = this.ticketRepository.create({
      userId: userId,
      ...createTicketDto,
      qrCode: qrPayload,
    });
    const pricing = await this.pricingRepository.findOne({ where: { id: ticket.pricingId } })
    if (!pricing) throw new NotFoundException(TicketErrors.TICKET_NOT_FOUND)
    pricing.soldTickets += 1;

    const savedTicket = await this.ticketRepository.save(ticket);
    await this.pricingRepository.save(pricing);

    return {
      message: `${TicketMessages.TICKET_CREATED} for user ${userId}`,
      ticket: savedTicket,
    };
  }

  async findEvents(eventId: string) {
    const allEvents = await this.ticketRepository.find({ where: { event: { id: eventId } } });
    if (!allEvents || allEvents.length <= 0)
      throw new NotFoundException(TicketErrors.NO_TICKETS_FOUND);

    return {
      message: TicketMessages.TICKETS_FETCHED,
      allEvents,
    };
  }

  async getTicketByEventId(id: string) {
    const tickets = await this.ticketRepository.find({ where: { event: { id } } })
    if (!tickets) return { message: [] }
    return { message: TicketMessages.TICKETS_FETCHED, tickets }
  }

  async deleteTicket(id: string) {
    const ticket = await this.ticketRepository.delete({ id });
    if (!ticket.affected) throw new BadRequestException(TicketErrors.DELETE_FAILED);

    return { message: TicketMessages.TICKET_DELETED };
  }

  async scanTicket(qrCode: string) {
    const ticket = await this.ticketRepository.findOne({ where: { qrCode } });
    if (!ticket) throw new NotFoundException(TicketErrors.TICKET_NOT_FOUND);
    else if (ticket.isUsed === true)
      throw new BadRequestException(TicketErrors.ALREADY_SCANNED);

    ticket.isUsed = true;
    await this.ticketRepository.save(ticket);

    return { message: TicketMessages.TICKET_APPROVED, ticket };
  }


  async remove(id: string) {
    const deletedTicket = await this.ticketRepository.delete({id})
    if(!deletedTicket){
      throw new BadRequestException(TicketErrors.DELETE_FAILED)
    }
    return {messsage: TicketMessages.TICKET_DELETED}
  }
}
