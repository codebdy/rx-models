/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryMeta } from 'src/meta/query/query-meta';
import { RelationMeta } from 'src/meta/query/relation-meta';
import { CommandMeta } from './command.meta';
import { QueryCommand } from './query-command';

export class QueryRelationCommand extends QueryCommand {
  constructor(
    protected relationMeta: RelationMeta,
    protected readonly commandMeta?: CommandMeta,
    protected readonly queryMeta?: QueryMeta,
  ) {
    super(commandMeta, queryMeta);
  }
}
