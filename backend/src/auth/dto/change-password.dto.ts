import { IsString,MinLength,Matches } from 'class-validator';
import { AuthErrors } from '../constants/auth.errors';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {

    @ApiProperty({description: "Enter old Password: "})
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD })
    oldPassword: string


    @ApiProperty({description: "Ënter New Password: "})
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD})
    newPassword: string
}