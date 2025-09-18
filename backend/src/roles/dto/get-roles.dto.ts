import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { RoleErrors } from "../constants/roles.errors"; // make sure the path is correct

export class GetRolesDto {
  @ApiProperty({
    description: "Role ID for the user",
    type: "string",
    example: "f9f0b7f3-f332-4246-8460-ae7b6491e40f",
    required: true,
  })
  @IsString({ message: RoleErrors.ROLE_NOT_EXISTS })
  @IsNotEmpty({ message: RoleErrors.ROLE_NOT_EXISTS })
  id: string;
}
