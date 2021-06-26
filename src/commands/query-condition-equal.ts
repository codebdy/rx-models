import { CommandType } from 'src/command/query-command';
import { QueryConditionCommand } from 'src/command/query-condition-command';

export class QueryConditionEqualCommand extends QueryConditionCommand {
  static description = `Equal condition command.`;

  static version = '1.0';

  static commandType = CommandType.QUERY_CONDITION_COMMAND;

  static commandName = 'equal';

  getWhereStatement(): [string, any] {
    throw new Error('Method not implemented.');
  }
}
