import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Permission } from "./permissions.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoleDto {


    @ApiProperty({
    description: "Updated list of permissions for the role",
    type: [Permission],
    example: [
      { actions: ["read"], resource: "events" },
      { actions: ["write"], resource: "events" },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => Permission)
  permissions: Permission[];
}
