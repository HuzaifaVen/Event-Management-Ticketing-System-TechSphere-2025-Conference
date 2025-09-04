import { User } from "src/users/entities/user.entity";
import { Entity, Column,JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../enums/userRoles.dto";
import { Permission } from "../dto/permissions.dto";


@Entity({ name: "roles" })
export class Roles {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: "jsonb" })
  permissions: Permission[];
}
