import { UserRole } from "../../roles/enums/userRoles.dto";
import { Column, OneToOne, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "src/roles/entities/roles.entity";
import { JoinColumn } from "typeorm";


@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ type: 'text', unique: true })
    email: string

    @Column({ type: 'text', nullable: true })
    password: string

    @Column()
    roleId: string

    @OneToOne(() => Roles, { cascade: true, eager: true, nullable: true  })
    @JoinColumn({ name: 'roleId' }) 
    role: Roles | null;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean
}
