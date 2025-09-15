import { IsEmail, IsOptional, IsString, MinLength, Matches, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { UserRole } from "../../roles/enums/userRoles.dto";
import { AuthErrors } from "../constants/auth.errors";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({
    description: "Full name of the user",
    example: "Abdullah Ahmed",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "User's email address (must be unique)",
    example: "abdullah12@gmail.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Profile image file',
  })
  @IsOptional()
  profileImg?: string;

  @ApiProperty({
    description: AuthErrors.Validation_PASSWORD,
    minLength: 8,
    example: "StrongPass123",
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD })
  password: string;

  @ApiProperty({
    description: "Role to assign to the user",
    enum: UserRole,
    example: UserRole.CUSTOMER,
    // required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: AuthErrors.USER_ROLE_VALIDATION })
  @Transform(({ value }) => value ?? UserRole.CUSTOMER)
  role: UserRole;
}
