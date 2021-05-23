import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class RxRole {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
