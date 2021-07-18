import { RxUser } from 'src/entity-interface/RxUser';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { SelectQueryBuilder } from 'typeorm';
import { getCommandsWhereStatement } from './get-commands-where-statement';
import { makeAbilitiesQueryBuilder } from './make-abilities-query-builder';

export function makeEffectCountQueryBuilder(
  meta: QueryEntityMeta,
  qb: SelectQueryBuilder<any>,
  me: RxUser,
): SelectQueryBuilder<any> {
  const commands = [];
  for (const command of meta.commands) {
    if (command.isEffectResultCount) {
      command.addToQueryBuilder(qb);
      commands.push(command);
    }
  }
  const [sql, params] = getCommandsWhereStatement(commands);
  sql && qb.andWhere(sql, params);
  qb = makeAbilitiesQueryBuilder(meta, qb, me);
  return qb;
}
