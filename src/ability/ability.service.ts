import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { request, Request } from 'express';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { RxUser } from 'src/entity-interface/rx-user';
import { RxAbility } from 'src/entity-interface/rx-ability';

@Injectable({ scope: Scope.REQUEST })
export class AbilityService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly typeormSerivce: TypeOrmService,
    private readonly schemaService: SchemaService,
  ) {}

  /**
   *
   * @returns 返回用于权限过滤的Sql语句，或者false，如果返回false表示没有权限
   */
  async validateEntityQuery(
    entityMeta: EntityMeta,
  ): Promise<false | [string, any]> {
    const authrized = ['', undefined] as [string, any];
    const user = request.user as RxUser;
    if (!user) {
      return false;
    }
    if (user.isSupper || user.isDemo) {
      return authrized;
    }
    const abilitys = (await this.typeormSerivce
      .getRepository('RxAbility')
      .createQueryBuilder('rxability')
      .leftJoinAndSelect('rxability.role', 'role')
      .where('entityUuid=:entityUuid and role.id IN (...:roleIds)', {
        entityUuid: entityMeta,
        roleIds: user.roles?.map((role) => role.id) || [],
      })
      .getMany()) as RxAbility[];
    for (const ability of abilitys) {
      console.log(ability);
    }
    return authrized;
  }
}
