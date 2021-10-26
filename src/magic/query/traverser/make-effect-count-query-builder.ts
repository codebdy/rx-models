import { RxUser } from 'src/entity-interface/RxUser';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { SelectQueryBuilder } from 'typeorm';
import { getDirectivesAndWhereStatement } from './get-directives-and-where-statement';
import { makeAbilitiesQueryBuilder } from './make-abilities-query-builder';

export function makeEffectCountQueryBuilder(
  meta: QueryEntityMeta,
  qb: SelectQueryBuilder<any>,
  me: RxUser,
): SelectQueryBuilder<any> {
  const directives = [];
  for (const directive of meta.directives) {
    if (directive.isEffectResultCount) {
      directive.addToQueryBuilder(qb);
      directives.push(directive);
    }
  }
  const [sql, params] = getDirectivesAndWhereStatement(directives);
  sql && qb.andWhere(sql, params);
  qb = makeAbilitiesQueryBuilder(meta, qb, me);
  return qb;
}
