import { CommandType } from 'src/command/query-command';
import { QueryConditionCommand } from 'src/command/query-condition-command';
import { createId } from 'src/util/create-id';

export class QueryConditionBetweenCommand extends QueryConditionCommand {
  static description = `Between condition command.`;

  static version = '1.0';

  static commandType = CommandType.QUERY_CONDITION_COMMAND;

  static commandName = 'between';

  getWhereStatement(field?: string, value?: string): [string, any] {
    if (!value || !value.length || value.length < 2) {
      throw new Error(
        `Field "${field}" value "${value}" can not be used to between command`,
      );
    }
    const paramName1 = 'param' + createId();
    const paramName2 = 'param' + createId();
    return [
      ` ${field} BETWEEN :${paramName1} AND ${paramName2} `,
      {
        [paramName1]: value[0],
        [paramName1]: value[1],
      },
    ];
  }
}
