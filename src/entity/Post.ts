import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class Post {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
