import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Media } from './Media';
import { Post } from './Post';

@Entity()
export class PostMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  altText: string;

  @ManyToOne(() => Post, (post) => post.medias)
  post: Post;

  @ManyToOne(() => Media)
  media: Media;
}
