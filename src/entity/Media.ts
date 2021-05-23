import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class Media {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
