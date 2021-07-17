import { QueryCommand } from 'src/command/query/query.command';
import { QueryResult } from 'src/common/query-result';
import { SelectQueryBuilder } from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
import { QueryMeta } from './query.meta';

export class QueryRelationMeta extends QueryMeta {
  name: string;
  parentEntityMeta: QueryMeta;
  entitySchema: EntitySchemaOptions<any>;
  relationCommands: QueryCommand[] = [];

  get entity() {
    return this.entitySchema.name;
  }

  pushCommand(command: QueryCommand) {
    this.relationCommands.push(command);
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    const whereStringArray: string[] = [];
    let whereParams: any = {};
    this.relationCommands.concat(this.conditionCommands).forEach((command) => {
      const [whereStr, param] = command.getWhereStatement() || [];
      if (whereStr) {
        whereStringArray.push(whereStr);
        whereParams = { ...whereParams, ...param };
      }

      command.addToQueryBuilder(qb);
    });

    qb.leftJoinAndSelect(
      `${this.parentEntityMeta.alias}.${this.name}`,
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
      `Please add relation ${relationName} of ${this.entitySchema.name} to query meta`,
    );
  }
}
