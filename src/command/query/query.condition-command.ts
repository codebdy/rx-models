import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { SchemaService } from 'src/schema/schema.service';

export class QueryConditionCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryRootMeta,
    protected readonly ownerMeta: QueryEntityMeta,
    protected readonly field: string,
    protected readonly magicService: MagicService,
    protected readonly schemaService: SchemaService,
  ) {
    super(commandMeta, rootMeta, magicService, schemaService);
  }

  get value() {
    return this.commandMeta?.value;
  }
}
