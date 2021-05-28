import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  AfterLoad,
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

  @AfterLoad()
  // keep the first 3 roles
  limitRoles() {
    this.roles = this.roles.slice(0, 3);
  }
}
