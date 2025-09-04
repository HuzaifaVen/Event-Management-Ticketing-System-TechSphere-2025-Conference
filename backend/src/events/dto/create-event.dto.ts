import { IsDate, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateEventDto {
  @IsString()
  id?: string;

  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @Type(() => Date) 
  @IsDate()        
  startDateTime?: Date;

  @Type(() => Date)
  @IsDate()
  endDateTime?: Date;

  @IsString()
  location?: string;
}
