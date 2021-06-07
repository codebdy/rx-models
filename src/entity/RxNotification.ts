import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RxApp } from './RxApp';

@Entity()
export class RxNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RxApp, (app) => app.notifications)
  app: RxApp;
}
