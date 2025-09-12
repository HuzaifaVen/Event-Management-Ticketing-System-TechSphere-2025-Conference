import { ApiParam, ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetRolesDto{

    @ApiProperty({
        description: "Role Id for the user",
        type: "string",
        example: "f9f0b7f3-f332-4246-8460-ae7b6491e40f"
    })
    @IsString()
    id: string
}