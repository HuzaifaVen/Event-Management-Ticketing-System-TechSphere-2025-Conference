import { UserRole } from '../entities/user.entity';
import { Transform } from 'class-transformer';
import { IsEmail,IsOptional, IsString, MinLength,Matches,IsEnum } from 'class-validator';
export class CreateUserDto {
    
    @IsString()
    name: string
    
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, {message: "Password should be at least 8 digits long"})
    password: string

     @IsOptional()
    @IsEnum(UserRole, { message: 'Role must be either ADMIN or USER' })
     @Transform(({ value }) => value ?? UserRole.CUSTOMER)
    role: UserRole

}
