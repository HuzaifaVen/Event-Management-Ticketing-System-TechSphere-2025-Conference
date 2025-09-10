import { IsString,MinLength,Matches, IsNumber, IsEmail } from 'class-validator';
import { AuthErrors } from '../constants/auth.errors';

export class ResetPasswordDto {
    @IsEmail()
    email: string

    @IsString()
    otp: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD })
    password: string
}