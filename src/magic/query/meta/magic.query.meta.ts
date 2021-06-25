import { QueryCommand } from 'src/command/query-command';
import { EntitySchema } from 'typeorm';
import { WhereMeta } from './where-meta';

export class MagicQueryMeta {
  model: string;
  entitySchema: EntitySchema<any>;
  where: WhereMeta;
  qbCommands: QueryCommand[] = [];

  get modelAlias() {
    return this.model?.toLowerCase();
  }
}
