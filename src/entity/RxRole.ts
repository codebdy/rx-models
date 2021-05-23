import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class Role {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
