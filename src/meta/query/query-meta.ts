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
  conditionCommands: QueryCommand[] = [];

  fetchString: 'getOne' | 'getMany' = TOKEN_GET_MANY;

  constructor() {
    this.id = createId();
  }

  get alias() {
    return this.model?.toLowerCase() + this.id;
  }

  addNotEffetCountCommandsToQueryBuilder(
    qb: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    return qb;
  }

  addEffetCountCommandsToQueryBuilder(
    qb: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    return qb;
  }

  filterResult(result: QueryResult): QueryResult {
    return result;
  }
      //paramParser.whereMeta?.makeQueryBuilder(qb);

    //for (const relation of paramParser.relations) {
    //  relation.makeQueryBuilder(qb, modelAlias);
    //}


  findOrRepairRelation(relationName: string): RelationMeta {
    return;
  }
}
