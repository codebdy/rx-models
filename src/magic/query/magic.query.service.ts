import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { MagicQueryParamsParser } from './param';

@Injectable()
export class MagicQueryService {
  async query(jsonStr: string) {
    const paramParser = new MagicQueryParamsParser(jsonStr);
    const queryBulider = getRepository(
      paramParser.modelUnit?.model,
    ).createQueryBuilder(paramParser.modelUnit?.modelAlias);
    const [
      whereString,
      whereParams,
    ] = paramParser.whereMeta.getWhereStatement();
    if (paramParser.select?.length > 0) {
      queryBulider.select(
        paramParser.select.map(
          (field) => paramParser.modelUnit?.modelAlias + '.' + field,
        ),
      );
    }
    for (const relation of paramParser.relations) {
      queryBulider.leftJoinAndSelect(
        `${paramParser.modelUnit?.modelAlias}.${relation.name}`,
        relation.relationModel,
      );
    }
    const orderMap = paramParser.orderBys.getpMap(
      paramParser.modelUnit?.modelAlias,
    );
    if (orderMap) {
      queryBulider.orderBy(orderMap);
    }
    queryBulider.where(whereString, whereParams);
    console.log(queryBulider.getSql(), whereParams, paramParser.takeCommand);
    return queryBulider[paramParser.takeCommand]();
  }
}
