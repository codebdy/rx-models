import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PublishedRxPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  uuid?: string;

  @Column({ nullable: true })
  name?: string;

  @Column('simple-json', { nullable: true })
  entities?: any;

  @Column('simple-json', { nullable: true })
  diagrams?: any;

  @Column('simple-json', { nullable: true })
  relations?: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
