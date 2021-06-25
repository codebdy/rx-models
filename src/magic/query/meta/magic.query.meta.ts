import { QueryBuilderCommand } from 'src/command/query-builder-command';
import { EntitySchema } from 'typeorm';
import { WhereMeta } from './where-meta';

export class MagicQueryMeta {
  model: string;
  entitySchema: EntitySchema<any>;
  where: WhereMeta;
  qbCommands: QueryBuilderCommand[] = [];

  get modelAlias() {
    return this.model?.toLowerCase();
  }
}
