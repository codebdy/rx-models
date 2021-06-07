import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RxApp } from './RxApp';

@Entity()
export class RxPage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RxApp, (app) => app.notifications)
  app: RxApp;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
