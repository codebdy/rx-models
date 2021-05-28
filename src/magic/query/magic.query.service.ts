import { Injectable } from '@nestjs/common';
import { createId } from 'src/utils/create-id';
import { getRepository } from 'typeorm';
import { MagicQueryParamsParser } from './param';

@Injectable()
export class MagicQueryService {
  async query(jsonStr: string) {
    const paramParser = new MagicQueryParamsParser(jsonStr);
    const queryBulider = getRepository(
      paramParser.modelUnit?.model,
    ).createQueryBuilder(paramParser.modelUnit?.modelAlias);

    if (paramParser.select?.length > 0) {
      queryBulider.select(
        paramParser.select.map(
          (field) => paramParser.modelUnit?.modelAlias + '.' + field,
        ),
      );
    }
    //queryBulider.loadRelationCountAndMap(
    //  `${paramParser.modelUnit?.modelAlias}.relationCount`,
    //  `${paramParser.modelUnit?.modelAlias}.roles`,
    //);
    for (const relation of paramParser.relations) {
      const relationAlias = `relation${createId()}`;
      queryBulider.leftJoinAndSelect(
        `${paramParser.modelUnit?.modelAlias}.${relation.name}`,
        relationAlias,
      );
    }

   //queryBulider.from((subQuery) => {
   //   return subQuery
   //     .select('role.name', 'roleName')
   //     .from(RxRole, 'role')
   //     .limit(1);
   // }, 'roleName');

    const orderMap = paramParser.orderBys.getpMap(
      paramParser.modelUnit?.modelAlias,
    );
    if (orderMap) {
      queryBulider.orderBy(orderMap);
    }

    paramParser.whereMeta?.makeQueryBuilder(queryBulider);
    const skipCommand = paramParser.modelUnit.getSkipCommand();
    if (skipCommand) {
      queryBulider.skip(skipCommand.count);
    }
    const takeCommand = paramParser.modelUnit.getTakeCommand();
    if (takeCommand) {
      queryBulider.take(takeCommand.count);
    }
    queryBulider.addSelect([paramParser.modelUnit?.modelAlias + '.id']);
    console.log(queryBulider.getSql());
    //return queryBulider[paramParser.takeCommand]();
    return queryBulider.getMany();
    //return queryBulider.getManyAndCount();
  }
}
