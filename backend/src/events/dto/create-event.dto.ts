import { IsDate, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ManyToOne,JoinColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { IsArray,ValidateNested } from "class-validator";
import { CreatePricingDto } from "src/pricing/dto/create-pricing.dto";

export class CreateEventDto {

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Date) 
  @IsDate()        
  startDateTime: Date;

  @Type(() => Date)
  @IsDate()
  endDateTime: Date;

  @IsOptional()
  @ManyToOne(() => User, (user) => user, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @IsString()
  location: string;

  @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePricingDto)
    pricings: CreatePricingDto[];
}
