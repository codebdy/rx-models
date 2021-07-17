import { QueryMeta } from 'src/magic-meta/query-old/query.meta';
import { QueryEntityMeta } from 'src/magic-meta/query-old/query.entity-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';
import { MagicService } from 'src/magic-meta/magic.service';

export class QueryConditionCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryEntityMeta,
    protected readonly ownerMeta: QueryMeta,
    protected readonly field: string,
    protected readonly magicService: MagicService,
  ) {
    super(commandMeta, rootMeta, magicService);
  }

  get value() {
    return this.commandMeta?.value;
  }
}
