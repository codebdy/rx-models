/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { QueryRelationMeta } from 'src/meta/query/query.relation-meta';
import { CommandMeta } from './command.meta';
import { QueryCommand } from './query-command';

export class QueryRelationCommand extends QueryCommand {
  constructor(
    protected relationMeta: QueryRelationMeta,
    protected readonly commandMeta?: CommandMeta,
    protected readonly queryMeta?: QueryModelMeta,
  ) {
    super(commandMeta, queryMeta);
  }
}
