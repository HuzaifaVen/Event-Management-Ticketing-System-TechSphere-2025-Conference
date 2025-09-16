import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';


@Controller('pricing')

export class PricingController {
  constructor() {}

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
