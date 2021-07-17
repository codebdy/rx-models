import { QueryCommand } from 'src/command/query/query.command';
import { TOKEN_GET_MANY } from 'src/magic/base/tokens';
import { createId } from 'src/util/create-id';
import { QueryRelationMeta } from './query.relation-meta';

export class QueryEntityMeta {
  id: number;
  entity: string;
  relations: QueryRelationMeta[] = [];
  commands: QueryCommand[];
  fetchString: 'getOne' | 'getMany' = TOKEN_GET_MANY;
  constructor() {
    this.id = createId();
  }

  get alias() {
    return this.entity?.toLowerCase() + this.id;
  }
}
