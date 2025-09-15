import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('otp_requests')
export class OtpRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string; 

  @Column({ type: 'varchar', length: 10, nullable: false })
  otp: string; 

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  verified: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
