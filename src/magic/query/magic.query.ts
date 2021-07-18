import { MagicQueryParser } from './magic.query.parser';
import { QueryResult } from 'src/common/query-result';
import { TOKEN_GET_MANY } from '../base/tokens';
import { MagicService } from 'src/magic-meta/magic.service';
import { AbilityService } from 'src/magic/ability.service';
import { QueryCommandService } from 'src/command/query-command.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { makeNotEffectCountQueryBuilder } from './traverser/make-not-effect-count-query-builder';
import { makeRelationsBuilder } from './traverser/make-relations-builder';
import { makeEffectCountQueryBuilder } from './traverser/make-effect-count-query-builder';

export class MagicQuery {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
    private readonly queryCommandService: QueryCommandService,
    private readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
  ) {}

  async query(json: any) {
    let totalCount = 0;
    const parser = new MagicQueryParser(
      this.queryCommandService,
      this.schemaService,
      this.magicService,
      this.abilityService,
    );
    const meta = await parser.parse(json);

    const qb = this.entityManager
      .getRepository(meta.entity)
      .createQueryBuilder(meta.alias);

    makeNotEffectCountQueryBuilder(meta, qb);
    makeRelationsBuilder([...meta.relations, ...meta.addonRelations], qb);

    if (meta.fetchString === TOKEN_GET_MANY) {
      totalCount = await qb.getCount();
      if (totalCount > 1000) {
        throw new Error('The result is too large, please use paginate command');
      }
    }

    makeEffectCountQueryBuilder(meta, qb, this.magicService.me);

    console.debug('SQL:', qb.getSql());
    const data = (await qb[meta.fetchString]()) as any;

    const result =
      meta.fetchString === TOKEN_GET_MANY
        ? ({ data, totalCount } as QueryResult)
        : ({ data } as QueryResult);
    return result;
    //return meta.filterResult(result);
  }
}
