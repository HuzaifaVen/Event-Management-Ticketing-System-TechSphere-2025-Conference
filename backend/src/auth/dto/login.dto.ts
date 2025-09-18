import { IsEmail, IsString, Matches, MinLength, IsNotEmpty } from 'class-validator';
import { AuthErrors } from '../constants/auth.errors';
import { ApiProperty } from '@nestjs/swagger';
import { AuthMessages } from '../constants/auth.messages';
import { Password } from 'src/decorators/password.decorator';

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'abdullah12@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS})
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'plaw12!@',
    required: true,
  })
  @IsString({ message: AuthErrors.PASSWORD_VALID })
  @IsNotEmpty({ message: AuthErrors.PASSWORD_REQUIRED})
  @MinLength(8, { message: AuthErrors.Validation_PASSWORD })
  @Password({ message: AuthErrors.Validation_PASSWORD })
  password: string;
}
