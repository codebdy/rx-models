import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
//import { RxUser } from './RxUser';

@Entity()
export class RxMediaFolder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  order: number;

  //@OneToOne(() => RxUser)
  //@JoinColumn()
  //user: RxUser;

  @ManyToOne(() => RxMediaFolder, (folder) => folder.children)
  parent: RxMediaFolder;

  @OneToMany(() => RxMediaFolder, (folder) => folder.parent)
  children: RxMediaFolder[];
}
