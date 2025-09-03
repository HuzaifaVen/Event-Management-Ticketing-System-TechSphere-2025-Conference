import { IsString,MinLength,Matches } from 'class-validator';

export class ForgotPasswordDto {
    @IsString()
    email: string;
}