import { IsEmail, IsString, Matches, MinLength } from "class-validator"

export class VerifyLoginDto {
    
    @IsEmail()
    email: string

    @IsString()
    otp: string

}