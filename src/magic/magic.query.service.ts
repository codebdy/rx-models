import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/User';
import { getRepository } from 'typeorm';

@Injectable()
export class MagicQueryService {
  async query(params: any) {
    return getRepository(User)
      .createQueryBuilder()
      .where('user.id = :id', { id: 1 })
      .getOne();
  }
}
