import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class RxPage {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
