import { Event } from "src/events/entities/event.entity";
import { Column, Entity ,JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tiers } from "../enums/pricing-tiers.enums";
import { IsOptional,IsArray } from "class-validator";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreatePricingDto } from "../dto/create-pricing.dto";

@Entity({ name: "pricings" })
export class Pricing {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    eventId: string

    @ManyToOne(() => Event, (event) => event.pricings, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'eventId' })
    event: Event | null;

    @Column({ type: "enum", enum: Tiers, default: Tiers.STUDENTS })
    tier: Tiers

    @Column()
    pricing: number

    @Column()
    maxTickets: number

    @Column({ default: 0 })
    soldTickets: number

    @Column({ type: 'decimal', nullable: true })
    discountPercentage?: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    discountName?: string;

    @Column({ type: 'timestamptz', nullable: true })
    discountStartDate?: Date;

    @Column({ type: 'timestamptz', nullable: true })
    discountEndDate?: Date;
}
