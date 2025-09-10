import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Permissions } from 'src/roles/decorators/permissions.decorators';
import { UserRole } from 'src/roles/enums/userRoles.dto';
import { Resources } from 'src/roles/enums/resources.enum';
import { Actions } from 'src/roles/enums/actions.enum';
import { PricingService } from 'src/pricing/pricing.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Pricing } from 'src/pricing/entities/pricing.entity';
import { Repository } from 'typeorm';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('events')
export class EventsController {

  constructor(
    private readonly eventsService: EventsService,
  ) { }

  @Permissions([{ roles: [UserRole.ORGANIZER], resource: Resources.EVENTS, actions: [Actions.WRITE] }])
  @Post("/create")
  create(@Body() createEventDto: CreateEventDto, @Req() req: any) {
    return this.eventsService.create(createEventDto, req.userId);
  }
  
  @Get("/all")
  findAll(@Req() req: any, @Query('page') page = 1, @Query('limit') limit = 10, @Query('location') location?: string, @Query('pricing') pricing?: string) {
    return this.eventsService.findAll(req.userId, {
      page: Number(page),
      limit: Number(limit),
      filters: { location, pricing }
    })
  }
  // @Permissions([{ roles: [UserRole.ORGANIZER], resource: Resources.EVENTS, actions: [Actions.READ] }])
  @Get("/:id")
  findOne(@Param("id") id: string, @Req() req: any) {
  
    return this.eventsService.findOne(id, req.userId);
  }

  @Permissions([{ roles: [UserRole.ORGANIZER], resource: Resources.EVENTS, actions: [Actions.WRITE] }])
  @Patch("/edit/:id")
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.eventsService.update(id, updateData);
  }


  @Permissions([{ roles: [UserRole.ORGANIZER], resource: Resources.EVENTS, actions: [Actions.WRITE] }])
  @Delete("/delete/:id")
  delete(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.remove(id, req.userId)
  }



}
