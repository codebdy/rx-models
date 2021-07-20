import { Injectable } from '@nestjs/common';
import { AbilityService } from 'src/magic/ability.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { MagicUpdateParser } from './magic.update.parser';

@Injectable()
export class MagicUpdate {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly schemaService: SchemaService,
    private readonly abilityService: AbilityService,
  ) {}

  async update(json: any) {
    const metas = await new MagicUpdateParser(
      this.schemaService,
      this.abilityService,
    ).parse(json);
    const result = {} as any;
    for (const meta of metas) {
      if (meta.ids.length > 0) {
        await this.entityManager
          .createQueryBuilder()
          .update(meta.entity)
          .set(meta.params)
          .where('id IN (:...ids)', { ids: meta.ids })
          .execute();
        result[meta.entity] = await this.entityManager
          .getRepository(meta.entity)
          .createQueryBuilder(meta.entity)
          .whereInIds(meta.ids)
          .getMany();
      }
    }
    return result;
  }
}
