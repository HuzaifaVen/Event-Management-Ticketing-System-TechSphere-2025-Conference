import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pricing } from './entities/pricing.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pricing]),
    AuthModule
  ],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService]
})
export class PricingModule {}
