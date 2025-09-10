import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "./entities/roles.entity";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./dto/roles.dto";
import { User } from "src/users/entities/user.entity";
import { DefaultRolePermissions } from "./dto/permissions.default";
import { RoleErrors } from "./constants/roles.errors";

@Injectable()

export class RoleServices {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>
    ) { }

    async createRole(dto: CreateRoleDto) {
        const role = this.rolesRepository.create({
            role: dto.role,
            permissions: dto.permissions?.length
                ? dto.permissions
                : DefaultRolePermissions[dto.role],
        });

        const savedRole = await this.rolesRepository.save(role);
        return savedRole;
    }

    async getRoleById(roleId: string) {
        const role = await this.rolesRepository.findOne({ where: { id: roleId } })
        if (!role) throw new NotFoundException(RoleErrors.ROLE_NOT_EXISTS)

        return { role }
    }
}