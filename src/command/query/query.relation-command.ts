/* eslint-disable @typescript-eslint/no-unused-vars */
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryEntityMeta } from 'src/magic-meta/query-old/query.entity-meta';
import { QueryRelationMeta } from 'src/magic-meta/query-old/query.relation-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';

export class QueryRelationCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryEntityMeta,
    protected readonly relationMeta: QueryRelationMeta,
    protected readonly magicService: MagicService,
  ) {
    super(commandMeta, rootMeta, magicService);
  }
}
