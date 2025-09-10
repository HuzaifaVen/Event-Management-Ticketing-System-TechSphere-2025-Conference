import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';


@UseGuards(AuthenticationGuard,AuthorizationGuard)
@Controller('tickets')

export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {
  }
  
  // @Permissions()
  @Post('/generate-ticket')
  create(@Body() createTicketDto: CreateTicketDto, @Req() req: any) {
    return this.ticketsService.create(createTicketDto,req.userId);
  }

  @Post("/scanned")
  scan(@Body() body:{qrCode:string}){
   
    return this.ticketsService.scanTicket(body.qrCode);
  }

  @Delete("/:id")
  delete(@Param('id') id:string ){
    return this.ticketsService.deleteTicket(id);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get('/:eventId')
  findEvents(@Param('evenId') eventId: string) {
    return this.ticketsService.findEvents(eventId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
