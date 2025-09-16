import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get role of a specific user' })
  @ApiParam({ name: 'id', type: String, example: 'b0a4ff3d-9c61-4b59-b1bb-2345f5aa6dcd' })
  @ApiResponse({ status: 200, description: 'User role fetched successfully' })
  @Get('/getRole/:id')
  findUserRole(@Param('id') id: string) {
    return this.usersService.findUserRole(id);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: String, example: 'b0a4ff3d-9c61-4b59-b1bb-2345f5aa6dcd' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findUser(id);
  }

  @ApiOperation({ summary: 'Block a user' })
  @ApiParam({ name: 'id', type: String, example: 'b0a4ff3d-9c61-4b59-b1bb-2345f5aa6dcd' })
  @ApiResponse({ status: 200, description: 'User blocked successfully' })
  @Post('/:id/block')
  blockUser(@Param('id') id: string) {
    return this.usersService.blockUser(id);
  }

  @ApiOperation({ summary: 'Unblock a user' })
  @ApiParam({ name: 'id', type: String, example: 'b0a4ff3d-9c61-4b59-b1bb-2345f5aa6dcd' })
  @ApiResponse({ status: 200, description: 'User unblocked successfully' })
  @Post('/:id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.usersService.unBlockUser(id);
  }
}
