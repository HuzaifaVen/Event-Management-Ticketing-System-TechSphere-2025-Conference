import { Controller, Get, Put, Param, Body } from "@nestjs/common";
import { RoleServices } from "./roles.service";
import { UpdateRoleDto } from "./dto/update-roles.dto";
import { ApiOperation, ApiParam, ApiTags, ApiResponse } from "@nestjs/swagger";
import { GetRolesDto } from "./dto/get-roles.dto";

@ApiTags("Roles")
@Controller("roles")
export class RolesController {
  constructor(private readonly roleServices: RoleServices) {}

  @ApiOperation({ summary: "Get role by ID" })
  @ApiParam({ name: "id", type: String, description: "Role ID (UUID)" })
  @ApiResponse({ status: 200, description: "Returns role details", type: GetRolesDto })
  @ApiResponse({ status: 404, description: "Role not found" })
  @Get("/:id")
  async findRoleById(@Param("id") id: string) {
    return this.roleServices.getRoleById(id);
  }

  @ApiOperation({ summary: "Update role by ID" })
  @ApiParam({ name: "id", type: String, description: "Role ID (UUID)" })
  @ApiResponse({ status: 200, description: "Role updated successfully" })
  @ApiResponse({ status: 404, description: "Role not found" })
  @Put("/updateRole/:id")
  async updateRoleById(@Param("id") id: string, @Body() dto: UpdateRoleDto) {
    return this.roleServices.updateRoleById(id, dto);
  }
}
