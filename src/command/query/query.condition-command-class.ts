import { QueryMeta } from 'src/magic-meta/query-old/query.meta';
import { QueryEntityMeta } from 'src/magic-meta/query-old/query.entity-meta';
import { QueryCommandClass } from './query.command.class';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';
import { MagicService } from 'src/magic-meta/magic.service';

export interface QueryConditionCommandClass extends QueryCommandClass {
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryEntityMeta,
    ownerMeta: QueryMeta,
    field: string,
    magicService: MagicService,
  ): QueryCommand;
}
