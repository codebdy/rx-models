import { EntitySchema } from 'typeorm';
import { PaginateCommand } from '../param/panigate-command';
import { SkipCommand } from './skip-command';
import { TakeCommand } from './take-command';
import { WhereMeta } from './where-meta';

export class MagicQueryMeta {
  model: string;
  entitySchema: EntitySchema<any>;
  where: WhereMeta;
  takeCommand: TakeCommand;
  skipCommand: SkipCommand;
  pginateCommand: PaginateCommand;

  get modelAlias() {
    return this.model?.toLowerCase();
  }
}
