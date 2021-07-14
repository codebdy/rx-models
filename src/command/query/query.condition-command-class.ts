import { QueryMeta } from 'src/magic-meta/query/query.meta';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { QueryCommandClass } from './query.command.class';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';

export interface QueryConditionCommandClass extends QueryCommandClass {
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryEntityMeta,
    ownerMeta: QueryMeta,
    field: string,
  ): QueryCommand;
}
