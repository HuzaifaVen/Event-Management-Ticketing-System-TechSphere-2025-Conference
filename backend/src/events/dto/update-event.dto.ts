import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { ManyToOne,JoinColumn } from 'typeorm';


export class UpdateEventDto extends PartialType(CreateEventDto) {
    @IsOptional()
      @ManyToOne(() => User, (user) => user, { eager: true })
      @JoinColumn({ name: 'userId' })
      user: User;
}
