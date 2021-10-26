import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { SelectQueryBuilder } from 'typeorm';
import { getDirectivesAndWhereStatement } from './get-directives-and-where-statement';
import { getDirectivesOrWhereStatement } from './get-directives-or-where-statement';

//构建qb
export function makeDirectivesQueryBuilder(
  meta: QueryEntityMeta,
  qb: SelectQueryBuilder<any>,
): SelectQueryBuilder<any> {
  const directives = [];
  for (const directive of meta.directives) {
    directive.addToQueryBuilder(qb);
    directives.push(directive);
  }
  const [sqlAnd, paramsAnd] = getDirectivesAndWhereStatement(directives);
  sqlAnd && qb.andWhere(sqlAnd, paramsAnd);

  const [sqlOr, paramsOr] = getDirectivesOrWhereStatement(directives);
  sqlOr && qb.orWhere(sqlOr, paramsOr);
  return qb;
}
