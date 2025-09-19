import { IsOptional, IsString } from 'class-validator';

export class GoogleAuthQueryDto {
  @IsOptional()
  @IsString()
  role?: string;
}
