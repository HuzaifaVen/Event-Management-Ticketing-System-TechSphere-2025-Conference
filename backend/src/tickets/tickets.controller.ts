import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';


import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ScanByQrDto } from './dto/scan-qrcode.dto';

@ApiTags('Tickets')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket generated successfully' })
  @Post('/generate-ticket')
  create(@Body() createTicketDto: CreateTicketDto, @Req() req: any) {
    return this.ticketsService.create(createTicketDto, req.userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch tickets by event category' })
  @ApiParam({ name: 'eventId', type: String, example: '248bd4f0-a0e2-4b4c-a503-6ec3b6cedfda' })
  @ApiResponse({ status: 200, description: 'Tickets fetched successfully' })
  @Get('/getTicketByCategory/:eventId')
  fetchTicketsByCategory(@Param('eventId') eventId: string) {
    return this.ticketsService.fetchTicketsByCategory(eventId);
  }

  @ApiOperation({ summary: 'Scan a ticket by QR code' })
  @ApiBody({ type: ScanByQrDto })
  @ApiResponse({ status: 200, description: 'Ticket scanned successfully' })
  @Patch('/scanned')
  scan(@Body() dto: ScanByQrDto) {
    return this.ticketsService.scanTicket(dto.qrCode);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export tickets as CSV/Excel' })
  @ApiResponse({ status: 200, description: 'Tickets exported successfully' })
  @Get('/exportTickets')
  async exportTickets(@Req() req: any, @Res() res: any) {
    const userId = req.userId;
    if (!userId) return res.status(401).send('Unauthorized');
    await this.ticketsService.exportTickets(userId, res);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a ticket by ID' })
  @ApiParam({ name: 'id', type: String, example: '2ac07724-898c-4127-bb90-5e30f43a3849' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.ticketsService.deleteTicket(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch all tickets for logged-in user' })
  @ApiResponse({ status: 200, description: 'Tickets fetched successfully' })
  @Get('/fetchTickets')
  fetchTickets(@Req() req: any) {
    return this.ticketsService.fetchTickets(req.userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find events by eventId' })
  @ApiParam({ name: 'eventId', type: String, example: '248bd4f0-a0e2-4b4c-a503-6ec3b6cedfda' })
  @ApiResponse({ status: 200, description: 'Events fetched successfully' })
  @Get('/:eventId')
  findEvents(@Param('eventId') eventId: string) {
    return this.ticketsService.findEvents(eventId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a ticket by ID (deprecated)' })
  @ApiParam({ name: 'id', type: String, example: '123' })
  @ApiResponse({ status: 200, description: 'Ticket removed successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
