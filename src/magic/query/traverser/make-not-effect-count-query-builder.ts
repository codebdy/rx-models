import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { SelectQueryBuilder } from 'typeorm';
import { getCommandsWhereStatement } from './get-commands-where-statement';

//构建qb
export function makeNotEffectCountQueryBuilder(
  meta: QueryEntityMeta,
  qb: SelectQueryBuilder<any>,
): SelectQueryBuilder<any> {
  for (const command of meta.commands) {
    if (!command.isEffectResultCount) {
      command.addToQueryBuilder(qb);
    }
  }
  const [sql, params] = getCommandsWhereStatement(
    this.notEffectCountModelCommands,
  );
  sql && qb.andWhere(sql, params);
  return qb;
}
