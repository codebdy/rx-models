import { RxUser } from 'src/entity/User';
import { UserSeed } from 'src/seeds/user.seed';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1621583221642 implements MigrationInterface {
  public async up(qureyRunner: QueryRunner): Promise<void> {
    await qureyRunner.manager.getRepository(RxUser).save(UserSeed);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(_: QueryRunner): Promise<void> {
    // do nothing
  }
}
