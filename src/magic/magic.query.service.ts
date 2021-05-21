import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/User';
import { getRepository } from 'typeorm';

export type User = any;

@Injectable()
export class MagicQueryService {
  private readonly users: User[];

  constructor() {}

  async query(params: any) {
    return getRepository(User)
      .createQueryBuilder()
      .where('user.id = :id', { id: 1 })
      .getOne();
  }
}
