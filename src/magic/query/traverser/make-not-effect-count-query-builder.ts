import { QueryEntityMeta } from 'magic-meta/query/query.entity-meta';
import { SelectQueryBuilder } from 'typeorm';
import { getDirectivesWhereStatement } from './get-directives-where-statement';

//构建qb
export function makeNotEffectCountQueryBuilder(
  meta: QueryEntityMeta,
  qb: SelectQueryBuilder<any>,
): SelectQueryBuilder<any> {
  const directives = [];
  for (const directive of meta.directives) {
    if (!directive.isEffectResultCount) {
      directive.addToQueryBuilder(qb);
      directives.push(directive);
    }
  }
  const [sql, params] = getDirectivesWhereStatement(directives);
  sql && qb.andWhere(sql, params);
  return qb;
}
