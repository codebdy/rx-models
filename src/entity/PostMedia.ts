import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RxMedia } from './RxMedia';
import { Post } from './Post';

@Entity()
export class PostMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  altText: string;

  @ManyToOne(() => Post, (post) => post.medias)
  post: Post;

  @ManyToOne(() => RxMedia)
  media: RxMedia;
}
