import { Controller, Get } from "@nestjs/common";
import { CreateRoleDto } from "./dto/roles.dto";
import { Body,Post } from "@nestjs/common";
import { RoleServices } from "./roles.service";

@Controller("roles")

export class RolesController{
    constructor(
        private roleServices: RoleServices,
    ){}

    @Post()
    async createRole(@Body() role:CreateRoleDto){
        return this.roleServices.createRole(role)
    }

    @Get()
    async findRoleById(@Body() roleId: string){
        return this.roleServices.getRoleById(roleId);
    }
}