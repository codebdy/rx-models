import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { MagicUpdateParamsParser } from './param/update.param.parser';

@Injectable()
export class MagicUpdateService {
  async update(json: any) {
    const metas = new MagicUpdateParamsParser(json).metas;
    const result = {} as any;
    for (const meta of metas) {
      console.log('哈哈', meta.params);
      const oneReslut = await getConnection()
        .createQueryBuilder()
        .update(meta.model)
        .set(meta.params)
        .where('id = :ids', { ids: 5 })
        .execute();
      result[meta.model] = oneReslut;
    }
    return result;
  }
}
