import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommandClass } from './query.command.class';
import { QueryCommand } from './query.command';
import { MagicService } from 'src/magic-meta/magic.service';

export interface QueryRelationCommandClass extends QueryCommandClass {
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryEntityMeta,
    relationMeta: QueryRelationMeta,
    magicService: MagicService,
  ): QueryCommand;
}
