import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Event } from './entities/event.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Pricing } from 'src/pricing/entities/pricing.entity';
import { PricingModule } from 'src/pricing/pricing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event,Roles,User,Pricing]),
    AuthModule,
    PricingModule,
    UsersModule
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}
