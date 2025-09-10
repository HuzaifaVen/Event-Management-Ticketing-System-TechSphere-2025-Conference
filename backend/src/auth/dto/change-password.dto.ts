import { IsString,MinLength,Matches } from 'class-validator';
import { AuthErrors } from '../constants/auth.errors';

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD })
    oldPassword: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD})
    newPassword: string
}