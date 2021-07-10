import { QueryMeta } from 'src/meta/query/query.meta';
import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { QueryCommandClass } from './query.command.class';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';

export interface QueryConditionCommandClass extends QueryCommandClass {
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryModelMeta,
    ownerMeta: QueryMeta,
    field: string,
  ): QueryCommand;
}
