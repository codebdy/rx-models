import { SelectQueryBuilder } from 'typeorm';

export interface QueryBuilderMaker {
  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any>;
}
