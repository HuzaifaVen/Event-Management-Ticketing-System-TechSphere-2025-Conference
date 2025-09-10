import { IsEmail, IsString, Matches, MinLength } from "class-validator"
import { AuthErrors } from "../constants/auth.errors"

export class LoginDto {
    
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD})
    password: string

}