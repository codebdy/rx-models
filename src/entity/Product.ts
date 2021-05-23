import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
