import { QueryMeta } from 'src/meta/query/query-meta';
import { CommandMeta } from './command.meta';
import { QueryCommand } from './query-command';

export class QueryConditionCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta?: CommandMeta,
    protected readonly queryMeta?: QueryMeta,
  ) {
    super(commandMeta, queryMeta);
  }
}
