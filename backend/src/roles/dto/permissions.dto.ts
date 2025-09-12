import { IsArray, IsEnum } from "class-validator"
import { Actions } from "../enums/actions.enum"
import { Resources } from "../enums/resources.enum"

export class Permission{
    @IsEnum(Resources)
    resource: Resources

    @IsArray()
  @IsEnum(Actions, { each: true })  
  actions: Actions[];

}

export class AuthorizationPermission{
     @IsEnum(Resources)
    resource: Resources

    @IsEnum(Actions)
    actions: Actions[]
    @IsArray()
    roles?: string[]; 
}
