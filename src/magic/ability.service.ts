import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { SchemaService } from 'src/schema/schema.service';
import { RxUser } from 'src/entity-interface/RxUser';
import { RxAbility } from 'src/entity-interface/RxAbility';
import { RxEntityAuthSettings } from 'src/entity-interface/RxEntityAuthSettings';
import { HttpException } from '@nestjs/common';
import { AbilityType } from 'src/entity-interface/AbilityType';

export class AbilityService {
  constructor(
    public readonly me: RxUser,
    private readonly typeormSerivce: TypeOrmService,
    private readonly schemaService: SchemaService,
  ) {}

  async isEntityExpand(entityUuid: string) {
    return (
      await this.typeormSerivce
        .getRepository<RxEntityAuthSettings>('RxEntityAuthSettings')
        .findOne({ entityUuid })
    )?.expand;
  }

  async getEntityQueryAbilities(entityUuid: string) {
    const user = this.me;
    //console.debug('Read权限筛查用户：', user.name);
    this.loginCheck(user);
    if (user.isSupper || user.isDemo) {
      return [];
    }
    return await this.typeormSerivce
      .getRepository<RxAbility>('RxAbility')
      .createQueryBuilder('rxability')
      .leftJoinAndSelect('rxability.role', 'role')
      .where(
        `rxability.entityUuid=:entityUuid 
        and rxability.abilityType = '${AbilityType.READ}' 
        and role.id IN (:...roleIds)
      `,
        {
          entityUuid,
          roleIds: user.roles?.map((role) => role.id) || [],
        },
      )
      .getMany();
  }

  async getEntityPostAbilities(entityUuid: string) {
    const user = this.me;
    console.debug('Post权限筛查用户：', user.name);
    this.loginCheck(user);
    if (user.isSupper || user.isDemo) {
      return [];
    }
    return await this.typeormSerivce
      .getRepository<RxAbility>('RxAbility')
      .createQueryBuilder('rxability')
      .leftJoinAndSelect('rxability.role', 'role')
      .where(
        `rxability.entityUuid=:entityUuid 
        AND (rxability.abilityType = '${AbilityType.CREATE}' OR rxability.abilityType = '${AbilityType.UPDATE}') 
        AND role.id IN (:...roleIds)
      `,
        {
          entityUuid,
          roleIds: user.roles?.map((role) => role.id) || [],
        },
      )
      .getMany();
  }

  async getEntityDeleteAbilities(entityUuid: string) {
    const user = this.me;
    console.debug('Delete权限筛查用户：', user.name);
    this.loginCheck(user);
    if (user.isSupper || user.isDemo) {
      return [];
    }
    return await this.typeormSerivce
      .getRepository<RxAbility>('RxAbility')
      .createQueryBuilder('rxability')
      .leftJoinAndSelect('rxability.role', 'role')
      .where(
        `rxability.entityUuid=:entityUuid 
        AND rxability.abilityType = '${AbilityType.DELETE}' 
        AND role.id IN (:...roleIds)
      `,
        {
          entityUuid,
          roleIds: user.roles?.map((role) => role.id) || [],
        },
      )
      .getMany();
  }

  private loginCheck(user: RxUser) {
    if (!user) {
      throw new HttpException(
        {
          status: 401,
          error: 'Please login first!',
        },
        401,
      );
    }
  }
}
