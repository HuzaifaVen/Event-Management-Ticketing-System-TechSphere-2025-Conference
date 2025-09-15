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
import { FindAllEventsQueryDto } from './dto/find-eventsById.dto';
import { ApiTags,ApiBearerAuth,ApiOperation, ApiBody, ApiResponse,ApiQuery,ApiParam} from '@nestjs/swagger';


@ApiTags('Events') 
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) { }

  // Create Event (Organizer Only)

  @ApiOperation({ summary: 'Create a new event (Organizer only)' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event created successfully' })

  @Permissions([{ roles: [UserRole.ORGANIZER], resource: Resources.EVENTS, actions: [Actions.WRITE] }])
  @Post("/create")
  create(@Body() createEventDto: CreateEventDto, @Req() req: any) {
    return this.eventsService.create(createEventDto, req.userId);
  }
  
  // Search All Events by specific location, pricing and user 

  @ApiOperation({
    summary: 'Get all events by logged-in user (Organizer/Admin)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'location',
    required: false,
    type: String,
    description: 'Optional filter by location',
  })
  @ApiQuery({
    name: 'pricing',
    required: false,
    type: String,
    description: 'Optional filter by pricing category',
  })
  @ApiResponse({ status: 200, description: 'List of events retrieved' })

  @Permissions([{ roles: [UserRole.ORGANIZER,UserRole.ADMIN,UserRole.CUSTOMER], resource: Resources.EVENTS, actions: [Actions.READ] }])
  @Get("/allById")
  findAllId(@Req() req: any, @Query() query: FindAllEventsQueryDto) {
    return this.eventsService.findAllById(req.userId, query)
  }

  // @ApiBearerAuth()
  // @Get("/all")
  // findAll(@Query() query: FindAllEventsQueryDto) {
  //   return this.eventsService.findAll({
  //     page: Number(page),
  //     limit: Number(limit),
  //     filters: { location, pricing }
  //   })
  // }


  // Search Event By ID
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Event retrieved successfully' })

  @Permissions([{ roles: [UserRole.ORGANIZER,UserRole.ADMIN,UserRole.CUSTOMER], resource: Resources.EVENTS, actions: [Actions.READ] }])
  @Get("/:id")
  findOne(@Param("id") id: string) {
    return this.eventsService.findOne(id);
  }


  @ApiOperation({ summary: 'Update event (Organizer/Admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID (UUID)' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })

  @Permissions([{ roles: [UserRole.ORGANIZER,UserRole.ADMIN], resource: Resources.EVENTS, actions: [Actions.UPDATE] }])
  @Patch("/edit/:id")
  update(@Param('id') id: string, @Body() updateData: UpdateEventDto) {
    return this.eventsService.update(id, updateData);
  }


  @ApiOperation({ summary: 'Delete event (Organizer/Admin Only)' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })

  @Permissions([{ roles: [UserRole.ORGANIZER,UserRole.ADMIN], resource: Resources.EVENTS, actions: [Actions.DELETE] }])
  @Delete("/delete/:id")
  delete(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.remove(id, req.userId)
  }



}
