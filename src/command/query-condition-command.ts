import { CommandMeta } from './command.meta';
import { QueryCommand } from './query-command';

export class QueryConditionCommand extends QueryCommand {
  constructor(commandMeta: CommandMeta) {
    super(commandMeta);
  }
}
