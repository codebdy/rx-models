import { QueryCommand } from 'src/command/query-command';
import { EntitySchema } from 'typeorm';
import { OrderBy } from './order-by';
import { Where } from './where';

export class MagicQueryMeta {
  model: string;
  select: string[];
  entitySchema: EntitySchema<any>;
  where: Where;
  orderBys: OrderBy;
  qbCommands: QueryCommand[] = [];

  get modelAlias() {
    return this.model?.toLowerCase();
  }
}
