import { IsEmail, IsString, Matches, MinLength } from "class-validator"

export class LoginDto {
    
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: "Password should be at least 8 digits long" })
    password: string

}