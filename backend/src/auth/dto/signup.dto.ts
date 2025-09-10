import { IsEmail,IsOptional, IsString, MinLength, Matches, IsEnum } from "class-validator"
import { Transform } from "class-transformer";
import { UserRole } from "../../roles/enums/userRoles.dto";
import { AuthErrors } from "../constants/auth.errors";

export class SignUpDto {
    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD })
    password: string

     @IsOptional()
    @IsEnum(UserRole, { message: AuthErrors.USER_ROLE_VALIDATION})
    @Transform(({ value }) => value ?? UserRole.CUSTOMER)
    role: UserRole
}