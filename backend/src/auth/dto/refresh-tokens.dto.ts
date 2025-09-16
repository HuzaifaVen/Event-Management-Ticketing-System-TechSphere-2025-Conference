import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthErrors } from '../constants/auth.errors';

export class RefreshTokenDto {
  // @ApiProperty({
  //   description: 'Refresh token string',
  //   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  //   required: true,
  // })
  @IsString({ message: AuthErrors.REFRESH_TOKEN })
  // @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
