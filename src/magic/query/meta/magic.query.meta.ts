import { QueryCommand } from 'src/command/query-command';
import { createId } from 'src/util/create-id';
import { EntitySchema } from 'typeorm';
import { OrderBy } from './order-by';
import { Relation } from './relation';
import { Where } from './where';

export class MagicQueryMeta {
  id: number;
  entitySchema: EntitySchema<any>;
  model: string;
  select: string[] = [];
  relations: Relation[] = [];
  where: Where;
  orderBys: OrderBy;
  qbCommands: QueryCommand[] = [];

  constructor() {
    this.id = createId();
  }

  /**
   * 一个查询内modelAlias是唯一的
   */
  get modelAlias() {
    return this.model?.toLowerCase() + this.id;
  }
}
