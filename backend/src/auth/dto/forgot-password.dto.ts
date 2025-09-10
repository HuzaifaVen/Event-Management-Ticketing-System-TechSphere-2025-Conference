import { IsString,MinLength,Matches, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}