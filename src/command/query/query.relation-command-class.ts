import { CommandMeta } from '../command.meta';
import { QueryCommandClass } from './query.command.class';
import { QueryCommand } from './query.command';
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';

export interface QueryRelationCommandClass extends QueryCommandClass {
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryRootMeta,
    relationMeta: QueryRelationMeta,
    magicService: MagicService,
  ): QueryCommand;
}
