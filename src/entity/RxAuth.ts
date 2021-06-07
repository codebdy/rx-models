import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RxApp } from './RxApp';

@Entity()
export class RxAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RxApp, (app) => app.notifications)
  app: RxApp;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
