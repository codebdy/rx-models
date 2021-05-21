import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { MagicQueryParam } from './magic.query.param';

@Injectable()
export class MagicQueryService {
  async query(params: MagicQueryParam) {
    return getRepository(params.model)
      .createQueryBuilder()
      .where('user.id = :id', { id: 1 })
      .getOne();
  }
}
