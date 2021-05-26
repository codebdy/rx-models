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
      const relationAlias = `relation${createId()}`;
      queryBulider.leftJoinAndSelect(
        `${paramParser.modelUnit?.modelAlias}.${relation.name}`,
        relationAlias,
      );
    }
    const orderMap = paramParser.orderBys.getpMap(
      paramParser.modelUnit?.modelAlias,
    );
    if (orderMap) {
      queryBulider.orderBy(orderMap);
    }
    queryBulider.where(whereString, whereParams);
    const skipCommand = paramParser.modelUnit.getSkipCommand();
    if (skipCommand) {
      queryBulider.skip(parseInt(skipCommand.params[0]));
    }
    const takeCommand = paramParser.modelUnit.getTakeCommand();
    if (takeCommand) {
      queryBulider.take(parseInt(takeCommand.params[0]));
    }
    queryBulider.addSelect([paramParser.modelUnit?.modelAlias + '.id']);
    console.log(queryBulider.getSql(), whereParams, paramParser.takeCommand);
    return queryBulider[paramParser.takeCommand]();
  }
}
