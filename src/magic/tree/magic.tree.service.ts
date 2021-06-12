import { Injectable } from '@nestjs/common';
import { getTreeRepository } from 'typeorm';
import { MagicQueryParamsParser } from '../query/param/query.param.parser';

@Injectable()
export class MagicTreeService {
  async query(jsonStr: string) {
    const paramParser = new MagicQueryParamsParser(jsonStr);
    return await getTreeRepository(paramParser.modelUnit?.model).find();
  }
}
