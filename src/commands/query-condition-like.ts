import { CommandType } from 'src/command/query/query.command';
import { QueryConditionCommand } from 'src/command/query/query.condition-command';
import { createId } from 'src/util/create-id';

export class QueryConditionEqualCommand extends QueryConditionCommand {
  static description = `Condition like command.`;

  static version = '1.0';

  static commandType = CommandType.QUERY_CONDITION_COMMAND;

  static commandName = 'like';

  getWhereStatement(): [string, any] {
    const paramName = 'param' + createId();
    return [
      ` ${this.field} LIKE :${paramName} `,
      {
        [paramName]: this.value,
      },
    ];
  }
}
