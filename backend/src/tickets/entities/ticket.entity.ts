import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Event } from "src/events/entities/event.entity";
import { JoinColumn } from "typeorm";


@Entity("tickets")
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string
    

    @Column()
    pricingId: string

    @Column({ type: 'varchar', length: 255, unique: true })
    qrCode: string

    @Column() // 👈 explicitly add this
  eventId: string;

  
    @Column({ default: false })
    isUsed: boolean

     @ManyToOne(() => Event, (event) => event.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' }) // creates eventId column automatically
  event: Event;

    @Column({ default: false })
    notified: boolean;
}
