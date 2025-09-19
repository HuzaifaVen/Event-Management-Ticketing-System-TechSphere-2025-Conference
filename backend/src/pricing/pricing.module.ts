import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pricing } from './entities/pricing.entity';
<<<<<<< HEAD
import { AuthModule } from '../auth/auth.module';
=======
import { AuthModule } from 'src/auth/auth.module';
>>>>>>> ac44b6d7b15ae1e86bae229d45c3aabb71f96157

@Module({
  imports: [
    TypeOrmModule.forFeature([Pricing]),
    AuthModule
  ],
  providers: [PricingService],
  exports: [PricingService]
})
export class PricingModule {}
