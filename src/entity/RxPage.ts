import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RxApp } from './RxApp';
import { RxAuth } from './RxAuth';

@Entity()
export class RxPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  maxWidth: string;

  @Column({ nullable: true })
  width: number;

  @Column('simple-json', { nullable: true })
  schema: any;

  @ManyToMany(() => RxAuth)
  @JoinTable()
  auths: RxAuth[];

  @Column({ nullable: true })
  query: string;

  @ManyToOne(() => RxApp, (app) => app.notifications)
  app: RxApp;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
