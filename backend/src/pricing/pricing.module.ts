import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pricing } from './entities/pricing.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pricing]),
    AuthModule
  ],
  providers: [PricingService],
  exports: [PricingService]
})
export class PricingModule {}
