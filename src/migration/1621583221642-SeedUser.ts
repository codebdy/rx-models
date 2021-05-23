import { RxUser } from 'src/entity/RxUser';
import { UserSeed } from 'src/seeds/user.seed';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1621583221642 implements MigrationInterface {
  public async up(qureyRunner: QueryRunner): Promise<void> {
    await qureyRunner.manager.getRepository(RxUser).save(UserSeed);
  }

  public async down(qureyRunner: QueryRunner): Promise<void> {
    await qureyRunner.manager.connection
      .createQueryBuilder()
      .delete()
      .from(RxUser)
      .where('true')
      .execute();
  }
}
