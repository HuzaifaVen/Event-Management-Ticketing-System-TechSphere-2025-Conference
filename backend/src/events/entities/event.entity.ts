import { IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Pricing } from 'src/pricing/entities/pricing.entity';


@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string

  @IsOptional()
  @ManyToOne(() => User, (user) => user, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamptz' })
  startDateTime: Date;

  @Column({ type: 'timestamptz' })
  endDateTime: Date;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @OneToMany(() => Pricing, (pricing) => pricing.event, { cascade: ['insert', 'update'], eager: true })
  pricings: Pricing[];

}
