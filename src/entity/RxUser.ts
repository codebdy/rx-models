import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { RxMedia } from './RxMedia';
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

  @Column({ default: false })
  isSupper: boolean;

  @Column({ default: false })
  isDemo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => RxRole)
  @JoinTable()
  roles: RxRole[];

  @ManyToOne(() => RxMedia)
  avatar: RxMedia;
}
