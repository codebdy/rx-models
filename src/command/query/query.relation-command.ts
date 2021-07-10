/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { QueryRelationMeta } from 'src/meta/query/query.relation-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';

export class QueryRelationCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryModelMeta,
    protected readonly relationMeta: QueryRelationMeta,
  ) {
    super(commandMeta, rootMeta);
  }
}
