import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthenticationGuard } from '../guards/auth.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { Permissions } from '../roles/decorators/permissions.decorators';
import { UserRole } from '../roles/enums/userRoles.dto';
import { Resources } from '../roles/enums/resources.enum';
import { Actions } from '../roles/enums/actions.enum';
import { FindAllEventsQueryDto } from './dto/find-eventsById.dto';
import { ApiTags,ApiBearerAuth,ApiOperation, ApiBody, ApiResponse,ApiQuery,ApiParam, ApiConsumes} from '@nestjs/swagger';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator.dto';
import { createMulterOptions } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { EVENT_UPLOAD_PATH } from '../../constants/upload_paths';


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
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event created successfully' })

  @Permissions([{ roles: [UserRole.ORGANIZER], resource: Resources.EVENTS, actions: [Actions.WRITE] }])
  @Post("/create")
  @UseInterceptors(FileInterceptor('profileImg', createMulterOptions(EVENT_UPLOAD_PATH)))
  create(@Body() createEventDto: CreateEventDto, @CurrentUserId() userId:string,@UploadedFile() file?:Express.Multer.File) {
    return this.eventsService.create(createEventDto,userId,file);
  }


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



  @Permissions([{ roles: [UserRole.ORGANIZER,UserRole.ADMIN,UserRole.ATTENDEE], resource: Resources.EVENTS, actions: [Actions.READ] }])
  @Get("/allById")
  findAllId(@CurrentUserId() userId: string , @Query() query: FindAllEventsQueryDto) {
    return this.eventsService.findAllById(userId, query)
  }



  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Event retrieved successfully' })

  @Permissions([{ roles: [UserRole.ORGANIZER,UserRole.ADMIN,UserRole.ATTENDEE], resource: Resources.EVENTS, actions: [Actions.READ] }])
  @Get("/:id")
  findOne(@Param("id") id: string) {
    return this.eventsService.findOne(id);
  }


  @ApiOperation({ summary: 'Update event (Organizer/Admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID (UUID)' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })

  @Permissions([{ roles: [UserRole.ORGANIZER,UserRole.ADMIN], resource: Resources.EVENTS, actions: [Actions.UPDATE] }])
  @Patch("/:id")
  update(@Param('id') id: string, @Body() updateData: UpdateEventDto) {
    return this.eventsService.update(id, updateData);
  }


  @ApiOperation({ summary: 'Delete event (Organizer/Admin Only)' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })

  @Permissions([{ roles: [UserRole.ORGANIZER,UserRole.ADMIN], resource: Resources.EVENTS, actions: [Actions.DELETE] }])
  @Delete("/:id")
  delete(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.eventsService.remove(id, userId)
  }
}
