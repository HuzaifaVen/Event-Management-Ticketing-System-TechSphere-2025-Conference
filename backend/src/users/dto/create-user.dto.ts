import { IsEmail, IsOptional, IsString, MinLength, Matches, IsUUID, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AuthErrors } from "../../auth/constants/auth.errors";
import { AuthMessages } from "../../auth/constants/auth.messages";
import { RoleErrors } from "../../roles/constants/roles.errors";
import { Password } from "../../decorators/password.decorator";

export class CreateUserDto {
  @ApiProperty({
    description: "Full name of the user",
    example: "John Doe",
    required: true,
  })
  @IsString({ message: AuthErrors.VALID_NAME})
  @IsNotEmpty({ message: AuthErrors.NAME_IS_REQUIRED })
  name: string;

  @ApiProperty({
    description: "User's email address",
    example: "john.doe@example.com",
    required: true,
  })
  @IsEmail({}, { message: AuthMessages.VALID_EMAIL_ADDRESS })
  @IsNotEmpty({ message: AuthMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({
    description: AuthErrors.Validation_PASSWORD,
    example: "MySecurePass123",
    required: true,
  })
  @IsString({ message:  AuthErrors.PASSWORD_VALID })
  @MinLength(8, { message: AuthErrors.Validation_PASSWORD })
  @Password({ message: AuthErrors.Validation_PASSWORD })
  @IsNotEmpty({ message: AuthErrors.PASSWORD_REQUIRED})
  password: string;

  @ApiProperty({
    description: "Role ID assigned to the user",
    example: "dfdeb945-228e-450e-a147-2574f0308967",
    required: false,
    nullable: true,
  })
  @IsUUID("4",{ message: RoleErrors.VALID_ROLE })
  @IsOptional()
  roleId?: string;

  @ApiProperty({
    description: "URL or file path for the user's profile image",
    example: "/uploads/user123.png",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: AuthErrors.VALID_PROFILE })
  profileImg?: string;
}
