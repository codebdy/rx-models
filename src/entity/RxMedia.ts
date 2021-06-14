import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RxUser } from './RxUser';

@Entity()
export class RxMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => RxUser)
  @JoinColumn()
  user: RxUser;
}
