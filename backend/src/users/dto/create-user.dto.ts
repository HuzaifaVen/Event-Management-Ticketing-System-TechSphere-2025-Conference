import { IsEmail, IsOptional, IsString, MinLength, Matches, IsEnum } from 'class-validator';
import { OneToOne } from 'typeorm';
import { Roles } from 'src/roles/entities/roles.entity';
import { JoinColumn } from 'typeorm';
import { AuthErrors } from 'src/auth/constants/auth.errors';

export class CreateUserDto {
    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, {message: AuthErrors.Validation_PASSWORD})
    password: string

    @OneToOne(() => Roles, { cascade: true, eager: true ,nullable:true})
    @JoinColumn({ name: 'roleId' }) // roleId in users table
    role: Roles | null;

}
