import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthErrors } from '../constants/auth.errors';

class EmailDto {
  @ApiProperty({ description: 'Email address', example: 'user@example.com', required: true })
  @IsString()
  @IsNotEmpty({ message: 'Email value is required' })
  value: string;

  @ApiProperty({ description: 'Email verified flag', example: true, required: true })
  @IsBoolean({ message: 'Verified must be boolean' })
  verified: boolean;
}

export class OAuthUserProfileDto {
  @ApiProperty({ description: 'User display name', example: 'John Doe', required: true })
  @IsString()
  @IsNotEmpty({ message: AuthErrors.NAME_IS_REQUIRED })
  displayName: string;

  @ApiProperty({ type: [EmailDto], description: 'List of emails', required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  emails: EmailDto[];

  @ApiProperty({ description: 'OAuth provider', example: 'google', required: true })
  @IsString()
  @IsIn(['google', 'twitter'], { message: AuthErrors.VALID_PROVIDER})
  provider: 'google' | 'twitter';
}
