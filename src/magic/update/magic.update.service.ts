import { Injectable } from '@nestjs/common';
import { getConnection, getRepository } from 'typeorm';
import { MagicUpdateParamsParser } from './param/update.param.parser';

@Injectable()
export class MagicUpdateService {
  async update(json: any) {
    const metas = new MagicUpdateParamsParser(json).metas;
    const result = {} as any;
    for (const meta of metas) {
      if (meta.ids.length > 0) {
        await getConnection()
          .createQueryBuilder()
          .update(meta.model)
          .set(meta.params)
          .where('id IN (:...ids)', { ids: meta.ids })
          .execute();
        result[meta.model] = await getRepository(meta.model)
          .createQueryBuilder(meta.model)
          .whereInIds(meta.ids)
          .getMany();
      }
    }
    return result;
  }
}
