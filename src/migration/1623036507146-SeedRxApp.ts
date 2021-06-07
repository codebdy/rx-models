import { RxApp } from 'src/entity/RxApp';
import { RxAuth } from 'src/entity/RxAuth';
import { RxPage } from 'src/entity/RxPage';
import rxAppSeed from 'src/seeds/rx/app.seed';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRxApp1623036507146 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const app of rxAppSeed) {
      const { pages, auths, ...appMeta } = app;
      const savedPages = await queryRunner.manager
        .getRepository(RxPage)
        .save(pages);
      const savedAuths = await queryRunner.manager
        .getRepository(RxAuth)
        .save(auths);
      const savedeApp = await queryRunner.manager
        .getRepository(RxApp)
        .save(appMeta);
      savedeApp.auths = savedAuths;
      savedeApp.pages = savedPages;
      savedeApp.entryPage = savedPages[0];

      await queryRunner.manager.getRepository(RxApp).save(savedeApp);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.connection
      .createQueryBuilder()
      .delete()
      .from(RxAuth)
      .where('true')
      .execute();

    await queryRunner.manager.connection
      .createQueryBuilder()
      .delete()
      .from(RxPage)
      .where('true')
      .execute();
    await queryRunner.manager.connection
      .createQueryBuilder()
      .delete()
      .from(RxApp)
      .where('true')
      .execute();
  }
}
