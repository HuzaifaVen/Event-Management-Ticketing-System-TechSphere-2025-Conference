import { ApiProperty } from '@nestjs/swagger';
import { IsString,MinLength,Matches, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
    
    @ApiProperty({description: "abdullah12@gmail.com"})
    @IsEmail()
    email: string;
}