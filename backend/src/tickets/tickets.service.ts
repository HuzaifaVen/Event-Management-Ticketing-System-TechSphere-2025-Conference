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
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { Event } from 'src/events/entities/event.entity';
import path from 'path';
import { TicketErrors } from './constants/ticket.errors';
import { TicketMessages } from './constants/ticket.messages';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: any) {
    const { eventId } = createTicketDto;

    const existingTicket = await this.ticketRepository.findOne({
      where: { eventId, userId },
    });
    if (existingTicket) throw new BadRequestException(TicketErrors.ALREADY_BOOKED);

    const qrPayload = uuidv4(); 

    const ticket = this.ticketRepository.create({
      userId: userId,
      ...createTicketDto,
      qrCode: qrPayload,
    });
    const savedTicket = await this.ticketRepository.save(ticket);

    return {
      message: `${TicketMessages.TICKET_CREATED} for user ${userId}`,
      ticket: savedTicket,
    };
  }

  findAll() {
    return `This action returns all tickets`;
  }

  async findEvents(eventId: string) {
    const allEvents = await this.ticketRepository.find({ where: { eventId } });
    if (!allEvents || allEvents.length <= 0)
      throw new NotFoundException(TicketErrors.NO_TICKETS_FOUND);

    return {
      message: TicketMessages.TICKETS_FETCHED,
      allEvents,
    };
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

    return { message: TicketMessages.TICKET_APPROVED };
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
