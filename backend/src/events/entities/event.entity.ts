import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Pricing } from 'src/pricing/entities/pricing.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.id, { eager: false, nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'timestamptz', nullable: false })
  startDateTime: Date;

  @Column({ type: 'timestamptz', nullable: false })
  endDateTime: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  location: string;

  @OneToMany(() => Pricing, (pricing) => pricing.event, { cascade: ['insert', 'update'], eager: true })
  pricings: Pricing[];

  @OneToMany(() => Ticket, (ticket) => ticket.event, { cascade: true })
  tickets: Ticket[];
}
