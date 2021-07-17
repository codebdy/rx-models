import { QueryCommand } from 'src/command/query/query.command';
import { createId } from 'src/util/create-id';

export class QueryRelationMeta {
  id: number;
  entity: string;
  name: string;
  relations: QueryRelationMeta[] = [];
  commands: QueryCommand[];
  constructor() {
    this.id = createId();
  }

  get alias() {
    return this.entity?.toLowerCase() + this.id;
  }
}
