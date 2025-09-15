import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../enums/userRoles.dto";
import { Permission } from "../dto/permissions.dto";

@Entity({ name: "roles" })
export class Roles {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ 
    type: "enum", 
    enum: UserRole, 
    default: UserRole.CUSTOMER, 
    nullable: false 
  })
  role: UserRole;

  @Column({ 
    type: "jsonb", 
    nullable: false 
  })
  permissions: Permission[];
}
