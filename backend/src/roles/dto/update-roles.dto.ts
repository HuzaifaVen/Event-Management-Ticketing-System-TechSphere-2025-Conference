import { ValidateNested, IsOptional, IsArray, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { Permission } from "./permissions.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { RoleErrors } from "../constants/roles.errors";

export class UpdateRoleDto {
  @ApiPropertyOptional({
    description: "Updated list of permissions for the role",
    type: [Permission],
    example: [
      { actions: ["read"], resource: "events" },
      { actions: ["write"], resource: "events" },
    ],
  })
  @IsOptional()
  @IsArray({ message: RoleErrors.VALID_PERMISSIONS})
  @ValidateNested({ each: true })
  @Type(() => Permission)
  @IsNotEmpty({ message: RoleErrors.PERMISSIONS_REQUIRED })
  permissions?: Permission[];
}
