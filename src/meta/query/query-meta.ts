import { QueryCommand } from 'src/command/query-command';
import { QueryResult } from 'src/common/query-result';
import { TOKEN_GET_MANY } from 'src/magic/base/tokens';
import { createId } from 'src/util/create-id';
import { EntitySchema, SelectQueryBuilder } from 'typeorm';
import { RelationMeta } from './relation-meta';

export class QueryMeta {
  id: number;
  entitySchema: EntitySchema<any>;
  model: string;
  relationMetas: RelationMeta[] = [];
  notEffectCountModelCommands: QueryCommand[] = [];
  effectCountModelCommands: QueryCommand[] = [];
  //conditionCommands: QueryCommand[] = [];

  fetchString: 'getOne' | 'getMany' = TOKEN_GET_MANY;

  constructor() {
    this.id = createId();
  }

  get alias() {
    return this.model?.toLowerCase() + this.id;
  }

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

  findRelatiOrFailed(relationName: string): RelationMeta {
    for (const relationMeta of this.relationMetas) {
      if (relationMeta.name === relationName) {
        return relationMeta;
      }
    }
    throw new Error(
      `Please add relation ${relationName} of ${this.model} to query meta`,
    );
  }
}
