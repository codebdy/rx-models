import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RxMediaFolder } from './RxMediaFolder';
//import { RxUser } from './RxUser';

@Entity()
export class RxMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  mimetype: string;

  @Column()
  fileName: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  size: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  //@OneToOne(() => RxUser)
  //@JoinColumn()
  //user: RxUser;

  @ManyToOne(() => RxMediaFolder)
  folder: RxMediaFolder;
}
