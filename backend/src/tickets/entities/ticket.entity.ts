import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "../../events/entities/event.entity";

@Entity("tickets")
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  userId: string;

  @Column({ type: "uuid", nullable: false })
  pricingId: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  qrCode: string;

  @Column({ type: "uuid", nullable: false })
  eventId: string;

  @Column({ type: "boolean", default: false, nullable: false })
  isUsed: boolean;

  @Column({ type: "boolean", default: false, nullable: false })
  notified: boolean;

  @ManyToOne(() => Event, (event) => event.tickets, { onDelete: "CASCADE" })
  @JoinColumn({ name: "eventId" })
  event: Event;
}
