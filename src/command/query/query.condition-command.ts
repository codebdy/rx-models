import { QueryMeta } from 'src/magic-meta/query/query.meta';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';

export class QueryConditionCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryEntityMeta,
    protected readonly ownerMeta: QueryMeta,
    protected readonly field: string,
  ) {
    super(commandMeta, rootMeta);
  }

  get value() {
    return this.commandMeta?.value;
  }
}
