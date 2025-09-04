import { IsEnum, IsString, ValidateNested } from "class-validator";
import { UserRole } from "../enums/userRoles.dto";
import { Type } from "class-transformer";
import { Permission } from "./permissions.dto";


export class CreateRoleDto {
   

    @IsEnum(UserRole)
    role: UserRole

    @ValidateNested({ each: true })
    @Type(() => Permission)
    permissions: Permission[];
}
