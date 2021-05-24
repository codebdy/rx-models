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
    queryBulider
      .leftJoinAndSelect(`${paramParser.modelUnit?.modelAlias}.roles`, 'RxRole')
      .where(whereString, whereParams);
    //.andWhere('rxuser.loginName = :loginName', { loginName: 'admin' })
    return queryBulider[paramParser.takeCommand]();
  }
}
