import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RxRole } from './RxRole';

@Entity()
export class RxUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loginName: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => RxRole)
  @JoinTable()
  roles: RxRole[];
}
