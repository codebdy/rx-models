import {
  Column,
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

  @Column()
  rxSlug: string;

  @Column()
  name: string;

  //预定义权限不可编辑和删除
  @Column({ default: false })
  predefined: boolean;

  @Column({ nullable: true })
  groupName: string;

  @ManyToOne(() => RxApp, (app) => app.notifications)
  app: RxApp;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
