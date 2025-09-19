import { UserRole } from "../../roles/enums/userRoles.dto";
import { Column, OneToOne, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../roles/entities/roles.entity";
import { JoinColumn } from "typeorm";
import { BaseEntity } from "src/model/base.entity";


@Entity({ name: 'users' })
export class User extends BaseEntity{
    @Column()
    name: string

    @Column({ type: 'text', unique: true })
    email: string

    @Column({nullable:true})
    provider: string


    @Column({ type: 'text', nullable: true })
    password: string

    @Column()
    roleId: string

    @OneToOne(() => Roles, { cascade: true, eager: true, nullable: true  })
    @JoinColumn({ name: 'roleId' }) 
    role: Roles | null;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean

    @Column({type:'boolean', default:"false"})
    isBlocked: boolean

    @Column({ type: 'text', nullable: true })
    profileImg: string | null;
}
