import { QueryCommand } from 'src/command/query/query.command';
import { QueryResult } from 'src/common/query-result';
import { TOKEN_GET_MANY } from 'src/magic/base/tokens';
import { SelectQueryBuilder } from 'typeorm';
import { QueryMeta } from './query.meta';

export class QueryEntityMeta extends QueryMeta {
  notEffectCountModelCommands: QueryCommand[] = [];
  effectCountModelCommands: QueryCommand[] = [];

  fetchString: 'getOne' | 'getMany' = TOKEN_GET_MANY;

  pushCommand(command: QueryCommand) {
    command.isEffectResultCount
      ? this.effectCountModelCommands.push(command)
      : this.notEffectCountModelCommands.push(command);
  }

  makeNotEffectCountQueryBuilder(
    qb: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    this.notEffectCountModelCommands.forEach((command) =>
      command.addToQueryBuilder(qb),
    );
    const [sql, params] = this.getCommandsWhereStatement(
      this.notEffectCountModelCommands,
    );
    sql && qb.andWhere(sql, params);

    this.relationMetas.forEach((relation) => relation.makeQueryBuilder(qb));
    return qb;
  }

  makeConditionQueryBuilder(
    qb: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    const [sql, params] = this.getCommandsWhereStatement(
      this.conditionCommands,
    );
    qb.where(sql, params);
    return qb;
  }

  makeEffectCountQueryBuilder(
    qb: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    this.effectCountModelCommands.forEach((command) =>
      command.addToQueryBuilder(qb),
    );
    const [sql, params] = this.getCommandsWhereStatement(
      this.effectCountModelCommands,
    );
    sql && qb.andWhere(sql, params);
    return qb;
  }

  filterResult(result: QueryResult): QueryResult {
    this.relationMetas.forEach((relation) => {
      relation.filterResult(result);
    });
    this.notEffectCountModelCommands.forEach(
      (command) => (result = command.filterResult(result)),
    );
    this.effectCountModelCommands.forEach(
      (command) => (result = command.filterResult(result)),
    );
    this.conditionCommands.forEach(
      (command) => (result = command.filterResult(result)),
    );
    return result;
  }
}
