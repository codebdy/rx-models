import { RxRole } from 'src/entity/RxRole';
import { RxUser } from 'src/entity/RxUser';
import { RoleSeed } from 'src/seeds/role.seed';
import { UserSeed } from 'src/seeds/user.seed';
import { IsNull, MigrationInterface, Not, QueryRunner } from 'typeorm';

export class SeedUser1621583221642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(RxUser);
    const role = await queryRunner.manager.getRepository(RxRole).save(RoleSeed);
    await userRepository.save(UserSeed);
    const demoUser = await userRepository.findOne({ loginName: 'demo' });
    demoUser.roles = [role[0]];
    await userRepository.save(demoUser);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .getRepository(RxRole)
      .delete({ id: Not(IsNull()) });
    await queryRunner.manager
      .getRepository(RxUser)
      .delete({ id: Not(IsNull()) });
  }
}
