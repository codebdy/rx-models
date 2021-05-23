import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { MagicQueryParamsParser } from './param';

@Injectable()
export class MagicQueryService {
  async query(jsonStr: string) {
    const paramParser = new MagicQueryParamsParser(jsonStr);
    return (
      getRepository(paramParser.model)
        .createQueryBuilder(paramParser.modelAlias)
        .leftJoinAndSelect(`${paramParser.modelAlias}.roles`, 'RxRole')
        .where({ loginName: 'demo' })
        //.andWhere('rxuser.loginName = :loginName', { loginName: 'admin' })
        .getOne()
    );
  }
}
