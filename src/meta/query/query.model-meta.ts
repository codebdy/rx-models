import { QueryCommand } from 'src/command/query-command';
import { QueryResult } from 'src/common/query-result';
import { TOKEN_GET_MANY } from 'src/magic/base/tokens';
import { SelectQueryBuilder } from 'typeorm';
import { QueryMeta } from './query.meta';

export class QueryModelMeta extends QueryMeta {
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
    console.log('嘿嘿', this.notEffectCountModelCommands);
    this.notEffectCountModelCommands.forEach((command) =>
      command.addToQueryBuilder(qb),
    );
    this.relationMetas.forEach((relation) => relation.makeQueryBuilder(qb));
    return qb;
  }

  makeEffectCountQueryBuilder(
    qb: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    this.effectCountModelCommands.forEach((command) =>
      command.addToQueryBuilder(qb),
    );
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
    //this.conditionCommands.forEach(
    //  (command) => (result = command.filterResult(result)),
    //);
    return result;
  }
}
