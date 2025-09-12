import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
// import { CreatePricingDto } from './dto/create-pricing.dto';
// import { UpdatePricingDto } from './dto/update-pricing.dto';
// import { Permissions } from 'src/roles/decorators/permissions.decorators';
// import { UserRole } from 'src/roles/enums/userRoles.dto';
// import { Resources } from 'src/roles/enums/resources.enum';
// import { Actions } from 'src/roles/enums/actions.enum';
// import { AuthController } from 'src/auth/auth.controller';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { AuthenticationGuard } from 'src/guards/auth.guard';

@UseGuards(AuthenticationGuard,AuthorizationGuard)
@Controller('pricing')

export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // @Post()
  // create(@Body() createPricingDto: CreatePricingDto) {
  //   return this.pricingService.create(createPricingDto);
  // }

  // @Get()
  // findAll() {
  //   return this.pricingService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.pricingService.findOne(+id);
  // }

  // @Permissions([{roles:[UserRole.ORGANIZER], resource: Resources.EVENTS, actions:[Actions.WRITE]}])
  // @Patch('/:id')
  // update(@Param('id') id: string, @Body() updatePricingDto: any) {
  //   return this.pricingService.update(id, updatePricingDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pricingService.remove(+id);
  // }
}
