import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Matches, MinLength } from "class-validator"

export class VerifyLoginDto {
    
    @ApiProperty({description:"Enter Email: "})
    @IsEmail()
    email: string

    @ApiProperty({description: "Enter OTP: "})
    @IsString()
    otp: string

}