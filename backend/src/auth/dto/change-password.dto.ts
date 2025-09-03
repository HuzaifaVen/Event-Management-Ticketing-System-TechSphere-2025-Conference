import { IsString,MinLength,Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: "OldPassword should be at least 8 digits long" })
    oldPassword: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: "New Password should be at least 8 digits long" })
    newPassword: string
}