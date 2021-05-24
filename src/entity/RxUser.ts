import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  AfterLoad,
  BeforeUpdate,
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
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeUpdate()
  private encryptPassword(): void {
    if (this.tempPassword !== this.password) {
      //
    }
  }
}
