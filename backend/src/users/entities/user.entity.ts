import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  ORGANIZER = 'organizer',
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}


@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({type: 'text', unique: true})
    email: string

    @Column({type: 'text', nullable: true})
    password: string

    @Column({type: 'enum', enum: UserRole, default:UserRole.CUSTOMER})
    role: UserRole
}
