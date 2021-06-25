import { SelectQueryBuilder } from 'typeorm';
import { MagicCommand } from './magic-command';

export interface QueryBuilderCommand extends MagicCommand {
  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any>;
}
