import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

@Injectable()
export class MagicQueryService {
  async query(params: any) {
    return getRepository(params?.model)
      .createQueryBuilder()
      .where('user.id = :id', { id: 1 })
      .getOne();
  }
}
