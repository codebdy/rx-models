import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class RxAuth {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
