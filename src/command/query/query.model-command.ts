import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';

export class QueryModelCommand extends QueryCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryModelMeta,
  ) {
    super(commandMeta, rootMeta);
  }
}
