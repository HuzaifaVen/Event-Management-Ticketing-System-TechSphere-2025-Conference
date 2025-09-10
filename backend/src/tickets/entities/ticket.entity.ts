import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tickets")
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string

    @Column()
    eventId: string

    @Column()
    pricingId: string

    @Column({ type: 'varchar', length: 255, unique: true })
    qrCode: string

    @Column({default:false})
    isUsed: boolean
}
