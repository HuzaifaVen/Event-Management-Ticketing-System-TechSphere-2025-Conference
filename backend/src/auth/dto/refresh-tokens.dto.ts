import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthErrors } from '../constants/auth.errors';

export class RefreshTokenDto {
 
  @IsOptional()
  @IsString({ message: AuthErrors.REFRESH_TOKEN })
  refreshToken: string;
}
