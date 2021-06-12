import { RxTemplate } from 'src/entity/RxTemplate';
import { TemplateSeed } from 'src/seeds/template.seed';
import { IsNull, MigrationInterface, Not, QueryRunner } from 'typeorm';

export class SeedTemplates1623475952184 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const templateRepository = queryRunner.manager.getRepository(RxTemplate);
    await templateRepository.save(TemplateSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .getRepository(RxTemplate)
      .delete({ id: Not(IsNull()) });
  }
}
