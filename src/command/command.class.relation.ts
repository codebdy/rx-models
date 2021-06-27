import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { QueryRelationMeta } from 'src/meta/query/query.relation-meta';
import { CommandClass } from './command.class';
import { CommandMeta } from './command.meta';
import { QueryCommand } from './query-command';

export interface RelationCommandClass extends CommandClass {
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryModelMeta,
    relationMeta: QueryRelationMeta,
  ): QueryCommand;
}
