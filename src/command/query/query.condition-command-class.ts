import { QueryCommandClass } from './query.command.class';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';

export interface QueryConditionCommandClass extends QueryCommandClass {
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryRootMeta,
    ownerMeta: QueryEntityMeta,
    field: string,
    magicService: MagicService,
  ): QueryCommand;
}
