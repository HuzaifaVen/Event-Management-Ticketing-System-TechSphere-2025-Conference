import { BaseEntity } from 'src/model/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('otp_requests')
export class OtpRequest extends BaseEntity{
 
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string; 

  @Column({ length: 255 })
  otp: string; 

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  verified: boolean;

}
