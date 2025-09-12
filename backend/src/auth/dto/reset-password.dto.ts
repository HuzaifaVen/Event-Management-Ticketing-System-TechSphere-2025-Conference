import { IsString,MinLength,Matches, IsNumber, IsEmail } from 'class-validator';
import { AuthErrors } from '../constants/auth.errors';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    
    @ApiProperty({description:"abdullah12@gmail.com"})
    @IsEmail()
    email: string

    @ApiProperty({description: "232423"})
    @IsString()
    otp: string

    @ApiProperty({description: "plaw12!@"})
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD })
    password: string
}