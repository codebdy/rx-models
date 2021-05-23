import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { MagicQueryParamsParser } from './param';

@Injectable()
export class MagicQueryService {
  async query(jsonStr: string) {
    const paramParser = new MagicQueryParamsParser(jsonStr);
    const queryBulider = getRepository(paramParser.model).createQueryBuilder(
      paramParser.modelAlias,
    );
    queryBulider
      .leftJoinAndSelect(`${paramParser.modelAlias}.roles`, 'RxRole')
      .where({ loginName: 'demo' });
    //.andWhere('rxuser.loginName = :loginName', { loginName: 'admin' })
    return queryBulider[paramParser.takeCommand]();
  }
}
