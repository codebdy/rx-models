/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';

export class QueryRelationCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryEntityMeta,
    protected readonly relationMeta: QueryRelationMeta,
  ) {
    super(commandMeta, rootMeta);
  }
}
