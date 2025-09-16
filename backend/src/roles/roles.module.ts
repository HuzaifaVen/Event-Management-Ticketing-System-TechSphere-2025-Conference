import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Roles } from "./entities/roles.entity";
import { RolesController } from "./roles.controller";
import { RoleServices } from "./roles.service";
import { User } from "../users/entities/user.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([Roles,User]),    
    ],
    controllers: [RolesController],
    providers: [RoleServices],
    exports: [RoleServices],
})

export class RoleModule {}