import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { QueryRelationMeta } from 'src/meta/query/query.relation-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommandClass } from './query.command.class';
import { QueryCommand } from './query.command';

export interface QueryRelationCommandClass extends QueryCommandClass {
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryModelMeta,
    relationMeta: QueryRelationMeta,
  ): QueryCommand;
}
