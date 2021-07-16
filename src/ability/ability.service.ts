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

  async validateEntityQueryAbility(
    entityMeta: EntityMeta,
  ): Promise<true | false | RxAbility[]> {
    const notAuthrized = [] as RxAbility[];
    const user = request.user as RxUser;
    if (!user) {
      return notAuthrized;
    }
    if (user.isSupper || user.isDemo) {
      return true;
    }
    const abilities = (await this.typeormSerivce
      .getRepository('RxAbility')
      .createQueryBuilder('rxability')
      .leftJoinAndSelect('rxability.role', 'role')
      .where(
        'entityUuid=:entityUuid and columnUuid is null and role.id IN (...:roleIds)',
        {
          entityUuid: entityMeta.uuid,
          roleIds: user.roles?.map((role) => role.id) || [],
        },
      )
      .getMany()) as RxAbility[];

    if (!abilities || abilities.length === 0) {
      return false;
    }

    for (const ablility of abilities) {
      //如果没有设置表达式,说明全部可读，直接返回true
      if (!ablility.expression && ablility.can) {
        return true;
      }
    }

    return abilities.filter((ablity) => ablity.can);
  }
}
