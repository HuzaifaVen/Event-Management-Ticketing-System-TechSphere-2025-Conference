import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../enums/userRoles.dto";
import { Permission } from "../dto/permissions.dto";
import { BaseEntity } from "src/model/base.entity";

@Entity({ name: "roles" })
export class Roles extends BaseEntity{

  @Column({ 
    type: "enum", 
    enum: UserRole, 
    default: UserRole.ATTENDEE, 
    nullable: false 
  })
  role: UserRole;

  @Column({ 
    type: "jsonb", 
    nullable: false 
  })
  permissions: Permission[];
}
