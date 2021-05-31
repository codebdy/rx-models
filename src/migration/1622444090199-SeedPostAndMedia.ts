import { Media } from 'src/entity/Media';
import { Post } from 'src/entity/Post';
import { PostMedia } from 'src/entity/PostMedia';
import { MediaSeed } from 'src/seeds/media.seed';
import { PostSeed } from 'src/seeds/post.seed';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPostAndMedia1622444090199 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const postRepository = queryRunner.manager.getRepository(Post);
    const poseMediaRepostory = queryRunner.manager.getRepository(PostMedia);
    const medias = await queryRunner.manager
      .getRepository(Media)
      .save(MediaSeed);
    const posts = await postRepository.save(PostSeed);
    for (const post of posts) {
      const postMedia1 = new PostMedia();
      const index = Math.floor(Math.random() * 8);
      postMedia1.media = medias[index];
      postMedia1.altText = 'Alt text';
      postMedia1.post = post;
      poseMediaRepostory.save(postMedia1);

      const postMedia2 = new PostMedia();
      postMedia2.media = medias[Math.floor(Math.random() * 8)];
      postMedia2.altText = 'Alt text';
      postMedia2.post = post;
      poseMediaRepostory.save(postMedia2);

      const postMedia3 = new PostMedia();
      postMedia3.media = medias[Math.floor(Math.random() * 8)];
      postMedia3.altText = 'Alt text';
      postMedia3.post = post;
      poseMediaRepostory.save(postMedia3);

      const postMedia4 = new PostMedia();
      postMedia4.media = medias[Math.floor(Math.random() * 8)];
      postMedia4.altText = 'Alt text';
      postMedia4.post = post;
      poseMediaRepostory.save(postMedia4);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.connection
      .createQueryBuilder()
      .delete()
      .from(PostMedia)
      .where('true')
      .execute();

    await queryRunner.manager.connection
      .createQueryBuilder()
      .delete()
      .from(Post)
      .where('true')
      .execute();
    await queryRunner.manager.connection
      .createQueryBuilder()
      .delete()
      .from(Media)
      .where('true')
      .execute();
  }
}
