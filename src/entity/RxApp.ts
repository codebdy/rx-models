import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class RxApp {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
