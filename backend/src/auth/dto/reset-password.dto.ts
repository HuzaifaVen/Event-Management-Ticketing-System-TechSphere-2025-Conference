import { IsString,MinLength,Matches, IsNumber } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    email: string

    @IsString()
    otp: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: "Password should be at least 8 digits long" })
    password: string
}