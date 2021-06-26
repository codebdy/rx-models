import { CommandType } from 'src/command/query-command';
import { QueryConditionCommand } from 'src/command/query-condition-command';

export class QueryConditionBetweenCommand extends QueryConditionCommand {
  static description = `Between condition command.`;

  static version = '1.0';

  static commandType = CommandType.QUERY_CONDITION_COMMAND;

  static commandName = 'between';

  getWhereStatement(): { whereSql: string; params: any } {
    throw new Error('Method not implemented.');
  }
}
