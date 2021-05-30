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
  private tempPassword: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loginName: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => RxRole)
  @JoinTable()
  roles: RxRole[];
}
