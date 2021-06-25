import { SelectQueryBuilder } from 'typeorm';

export interface QueryBuilderCommand {
  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any>;
}
