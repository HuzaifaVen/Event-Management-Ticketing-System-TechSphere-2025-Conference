import { IsArray, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Actions } from "../enums/actions.enum";
import { Resources } from "../enums/resources.enum";
import { RoleErrors } from "../constants/roles.errors";

export class Permission {
  @ApiProperty({
    description: "Resource for which the permission applies",
    enum: Resources,
    required: true,
  })
  @IsEnum(Resources, { message: RoleErrors.RESOURCE_INVALID })
  @IsNotEmpty({ message: RoleErrors.RESOURCE_REQUIRED })
  resource: Resources;

  @ApiProperty({
    description: "List of allowed actions on the resource",
    enum: Actions,
    isArray: true,
    required: true,
  })
  @IsArray({ message: RoleErrors.ACTIONS_INVALID_ARRAY })
  @IsEnum(Actions, { each: true, message: RoleErrors.ACTIONS_INVALID_ENUM })
  @IsNotEmpty({ message: RoleErrors.ACTIONS_REQUIRED })
  actions: Actions[];
}

export class AuthorizationPermission {
  @ApiProperty({
    description: "Resource for which the permission applies",
    enum: Resources,
    required: true,
  })
  @IsEnum(Resources, { message: RoleErrors.RESOURCE_INVALID })
  @IsNotEmpty({ message: RoleErrors.RESOURCE_REQUIRED })
  resource: Resources;

  @ApiProperty({
    description: "Actions allowed on the resource",
    enum: Actions,
    isArray: true,
    required: true,
  })
  @IsArray({ message: RoleErrors.ACTIONS_INVALID_ARRAY })
  @IsEnum(Actions, { each: true, message: RoleErrors.ACTIONS_INVALID_ENUM })
  @IsNotEmpty({ message: RoleErrors.ACTIONS_REQUIRED })
  actions: Actions[];

  @ApiProperty({
    description: "List of roles associated with this permission (optional)",
    example: ["ADMIN", "MANAGER"],
    required: false,
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray({ message: RoleErrors.ROLES_INVALID_ARRAY })
  roles?: string[];
}
