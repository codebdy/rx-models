import { QueryCommand } from 'src/command/query-command';
import { QueryResult } from 'src/common/query-result';
import { createId } from 'src/util/create-id';
import { EntitySchema, SelectQueryBuilder } from 'typeorm';
import { QueryMeta } from './query-meta';

export class RelationMeta {
  private id: number;
  name: string;
  parentModelMeta: QueryMeta | RelationMeta;
  entitySchema: EntitySchema<any>;
  relationMetas: RelationMeta[] = [];
  relationCommands: QueryCommand[] = [];

  constructor() {
    this.id = createId();
  }

  get model() {
    return this.entitySchema.options.name;
  }

  get alias() {
    return 'relation' + this.id;
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
    return result;
  }

  findRelatiOrFailed(relationName: string): RelationMeta {
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
