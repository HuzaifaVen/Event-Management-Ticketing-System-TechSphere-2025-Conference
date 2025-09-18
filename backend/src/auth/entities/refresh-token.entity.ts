import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from 'src/model/base.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken  extends BaseEntity{
 
  @Column({ type: 'text', nullable: false })
  token: string; // token text cannot be null

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  revoked: boolean;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: false })
  userId: string;
}
