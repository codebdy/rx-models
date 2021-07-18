/* eslint-disable @typescript-eslint/no-unused-vars */
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';

export class QueryRelationCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryRootMeta,
    protected readonly relationMeta: QueryRelationMeta,
    protected readonly magicService: MagicService,
  ) {
    super(commandMeta, rootMeta, magicService);
  }
}
