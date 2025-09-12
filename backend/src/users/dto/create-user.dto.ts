import { IsEmail, IsOptional, IsString, MinLength, Matches, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AuthErrors } from "src/auth/constants/auth.errors";

export class CreateUserDto {
  @ApiProperty({
    description: "Full name of the user",
    example: "John Doe",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "User's email address",
    example: "john.doe@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password must be at least 8 characters long and contain at least one number",
    example: "MySecurePass123",
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])/, { message: AuthErrors.Validation_PASSWORD })
  password: string;

  @ApiProperty({
    description: "Role ID assigned to the user",
    example: "dfdeb945-228e-450e-a147-2574f0308967",
    // required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  roleId?: string;
}
