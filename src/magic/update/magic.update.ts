import { Injectable } from '@nestjs/common';
import { AbilityService } from 'src/ability/ability.service';
import { EntityManager } from 'typeorm';
import { MagicUpdateParamsParser } from './param/update.param.parser';

@Injectable()
export class MagicUpdate {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
  ) {}

  async update(json: any) {
    const metas = new MagicUpdateParamsParser(json).metas;
    const result = {} as any;
    for (const meta of metas) {
      if (meta.ids.length > 0) {
        await this.entityManager
          .createQueryBuilder()
          .update(meta.model)
          .set(meta.params)
          .where('id IN (:...ids)', { ids: meta.ids })
          .execute();
        result[meta.model] = await this.entityManager
          .getRepository(meta.model)
          .createQueryBuilder(meta.model)
          .whereInIds(meta.ids)
          .getMany();
      }
    }
    return result;
  }
}
