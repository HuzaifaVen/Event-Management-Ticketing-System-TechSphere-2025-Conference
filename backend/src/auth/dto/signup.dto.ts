import { IsEmail, IsOptional, IsString, MinLength, Matches, IsEnum, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";
import { UserRole } from "../../roles/enums/userRoles.dto";
import { AuthErrors } from "../constants/auth.errors";
import { ApiProperty } from "@nestjs/swagger";
import { AuthMessages } from "../constants/auth.messages";
import { Password } from "../../decorators/password.decorator";

export class SignUpDto {
  @ApiProperty({
    description: "Full name of the user",
    example: "Abdullah Ahmed",
    required: true,
  })
  @IsString({ message: AuthErrors.VALID_NAME })
  @IsNotEmpty({ message: AuthErrors.NAME_IS_REQUIRED })
  name: string;

  @ApiProperty({
    description: "User's email address (must be unique)",
    example: "abdullah12@gmail.com",
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS})
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({
    type: "string",
    format: "binary",
    required: false,
    description: "Profile image file",
  })
  @IsOptional()
  @IsString({ message: AuthErrors.VALID_PROFILE })
  profileImg?: string;

  @ApiProperty({
    description: AuthErrors.Validation_PASSWORD,
    minLength: 8,
    example: "StrongPass123",
    required: true,
  })
  @IsString({ message: AuthErrors.Validation_PASSWORD })
  @IsNotEmpty({ message: AuthErrors.PASSWORD_REQUIRED })
  @MinLength(8, { message: AuthErrors.Validation_PASSWORD })
  @Password({ message: AuthErrors.Validation_PASSWORD })
  password: string;

  @ApiProperty({
    description: "Role to assign to the user",
    enum: UserRole,
    example: UserRole.ATTENDEE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: AuthErrors.USER_ROLE_VALIDATION })
  role: UserRole;
}
