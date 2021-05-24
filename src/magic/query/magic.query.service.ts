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
    queryBulider.where(whereString, whereParams);
    return queryBulider[paramParser.takeCommand]();
  }
}
