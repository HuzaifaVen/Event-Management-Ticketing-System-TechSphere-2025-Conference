import { IsEnum, ValidateNested } from "class-validator";
import { UserRole } from "../enums/userRoles.dto";
import { Type } from "class-transformer";
import { Permission } from "./permissions.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {

    @ApiProperty({
        description: "Role type for the user",
        enum: UserRole,
        example: UserRole.CUSTOMER,
    })
    @IsEnum(UserRole)
    role: UserRole;

    @ApiProperty({
        description: "List of permissions assigned to the role",
        type: [Permission],
        example: [
            { name: "read", description: "Allows reading resources" },
            { name: "write", description: "Allows modifying resources" }
        ]
    })
    @ValidateNested({ each: true })
    @Type(() => Permission)
    permissions: Permission[];
}
