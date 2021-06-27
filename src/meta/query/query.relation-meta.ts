import { QueryCommand } from 'src/command/query-command';
import { QueryResult } from 'src/common/query-result';
import { EntitySchema, SelectQueryBuilder } from 'typeorm';
import { QueryMeta } from './query.meta';
import { QueryModelMeta } from './query.model-meta';

export class QueryRelationMeta extends QueryMeta {
  name: string;
  parentModelMeta: QueryModelMeta | QueryRelationMeta;
  entitySchema: EntitySchema<any>;
  relationCommands: QueryCommand[] = [];

  get model() {
    return this.entitySchema.options.name;
  }

  pushCommand(command: QueryCommand) {
    this.relationCommands.push(command);
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    const whereStringArray: string[] = [];
    let whereParams: any = {};
    this.relationCommands.forEach((command) => {
      const [whereStr, param] = command.getWhereStatement() || [];
      if (whereStr) {
        whereStringArray.push(whereStr);
        whereParams = { ...whereParams, ...param };
      }

      command.addToQueryBuilder(qb);
    });

    qb.leftJoinAndSelect(
      `${this.parentModelMeta.alias}.${this.name}`,
      this.alias,
      whereStringArray.join(' AND '),
      whereParams,
    );
    for (const subRelation of this.relationMetas) {
      subRelation.makeQueryBuilder(qb);
    }

    return qb;
  }

  filterResult(result: QueryResult): QueryResult {
    this.relationCommands.forEach(
      (command) => (result = command.filterResult(result)),
    );
    this.conditionCommands.forEach(
      (command) => (result = command.filterResult(result)),
    );
    return result;
  }

  findRelatiOrFailed(relationName: string): QueryRelationMeta {
    for (const relationMeta of this.relationMetas) {
      if (relationMeta.name === relationName) {
        return relationMeta;
      }
    }
    throw new Error(
      `Please add relation ${relationName} of ${this.entitySchema.options.name} to query meta`,
    );
  }
}
