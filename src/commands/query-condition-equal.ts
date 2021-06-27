import { CommandType } from 'src/command/query-command';
import { QueryConditionCommand } from 'src/command/query-condition-command';
import { createId } from 'src/util/create-id';

export class QueryConditionEqualCommand extends QueryConditionCommand {
  static description = `Equal condition command.`;

  static version = '1.0';

  static commandType = CommandType.QUERY_CONDITION_COMMAND;

  static commandName = 'equal';

  getWhereStatement(field?: string, value?: string): [string, any] {
    const paramName = 'param' + createId();
    return [
      ` ${field} = :${paramName} `,
      {
        [paramName]: value,
      },
    ];
  }
}
