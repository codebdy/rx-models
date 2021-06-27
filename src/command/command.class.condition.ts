import { QueryMeta } from 'src/meta/query/query.meta';
import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { CommandClass } from './command.class';
import { CommandMeta } from './command.meta';
import { QueryCommand } from './query-command';

export interface ConditionCommandClass extends CommandClass {
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryModelMeta,
    ownerMeta: QueryMeta,
    field: string,
  ): QueryCommand;
}
