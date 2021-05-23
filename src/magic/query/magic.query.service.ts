import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { MagicQueryParam } from './magic.query.param';

@Injectable()
export class MagicQueryService {
  async query(params: MagicQueryParam) {
    return (
      getRepository(params.model)
        .createQueryBuilder()
        .where({ loginName: 'demo' })
        //.andWhere('rxuser.loginName = :loginName', { loginName: 'admin' })
        .getOne()
    );
  }
}
