
import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { AuthErrors } from '../constants/auth.errors';
import { ApiProperty } from '@nestjs/swagger';
import { AuthMessages } from '../constants/auth.messages';
import { Password } from 'src/decorators/password.decorator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Enter old password',
    required: true,
  })
  @IsString({ message: AuthErrors.OLD_PASSWORD_VALID})
  @IsNotEmpty({ message: AuthErrors.OLD_PASSWORD_REQUIRED })
  @MinLength(8, { message: AuthErrors.OLD_PASSWORD_REQUIREMENT })
  @Password({ message: AuthErrors.Validation_PASSWORD })
  oldPassword: string;

  @ApiProperty({
    description: 'Enter new password',
    required: true,
  })
  @IsString({ message: AuthErrors.NEW_PASSWORD_VALID })
  @IsNotEmpty({ message: AuthErrors.NEW_PASSWORD_REQUIRED })
  @MinLength(8, { message: AuthErrors.NEW_PASSWORD_REQUIREMENT })
  @Password({ message: AuthErrors.Validation_PASSWORD })
  newPassword: string;
}
