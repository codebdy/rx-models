import { QueryMeta } from 'src/meta/query/query.meta';
import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { CommandMeta } from './command.meta';
import { QueryCommand } from './query-command';

export class QueryConditionCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryModelMeta,
    protected readonly ownerMeta: QueryMeta,
    protected readonly field: string,
  ) {
    super(commandMeta, rootMeta);
  }

  get value() {
    return this.commandMeta?.value;
  }
}
