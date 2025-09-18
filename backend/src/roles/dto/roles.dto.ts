import { IsEnum, ValidateNested, IsNotEmpty, IsArray } from "class-validator";
import { UserRole } from "../enums/userRoles.dto";
import { Type } from "class-transformer";
import { Permission } from "./permissions.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
  @ApiProperty({
    description: "Role type for the user",
    enum: UserRole,
    example: UserRole.ATTENDEE,
    required: true,
  })
  @IsEnum(UserRole, { message: "Role must be a valid UserRole enum value" })
  @IsNotEmpty({ message: "Role is required" })
  role: UserRole;

  @ApiProperty({
    description: "List of permissions assigned to the role",
    type: [Permission],
    required: true,
    example: [
      { resource: "EVENTS", actions: ["READ", "WRITE"] },
      { resource: "USERS", actions: ["READ"] },
    ],
  })
  @IsArray({ message: "Permissions must be an array" })
  @ValidateNested({ each: true })
  @Type(() => Permission)
  @IsNotEmpty({ message: "Permissions cannot be empty" })
  permissions: Permission[];
}
