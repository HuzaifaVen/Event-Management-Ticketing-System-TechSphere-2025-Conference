import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { RoleModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Roles]), 
    RoleModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
