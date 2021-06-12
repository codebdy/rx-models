import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { RxUser } from './RxUser';

@Entity()
@Tree('closure-table')
export class RxMediaFolder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  order: number;

  @OneToOne(() => RxUser)
  @JoinColumn()
  user: RxUser;

  @TreeChildren()
  children: RxMediaFolder[];

  @TreeParent()
  parent: RxMediaFolder;
}
