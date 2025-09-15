import { Event } from "src/events/entities/event.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tiers } from "../enums/pricing-tiers.enums";

@Entity({ name: "pricings" })
export class Pricing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.pricings, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "eventId" })
  event?: Event | null;

  @Column({ type: "enum", enum: Tiers, default: Tiers.STUDENTS, nullable: false })
  tier: Tiers;

  @Column({ type: "decimal", nullable: false })
  pricing: number;

  @Column({ type: "int", nullable: false })
  maxTickets: number;

  @Column({ type: "int", default: 0, nullable: false })
  soldTickets: number;

  @Column({ type: "decimal", nullable: true })
  discountPercentage?: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  discountName?: string;

  @Column({ type: "timestamptz", nullable: true })
  discountStartDate?: Date;

  @Column({ type: "timestamptz", nullable: true })
  discountEndDate?: Date;
}
