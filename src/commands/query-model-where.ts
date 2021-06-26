import { CommandType, QueryCommand } from 'src/command/query-command';
import { parseWhereString } from 'src/meta/query/parseWhereString';

export class QueryModelWhereCommand extends QueryCommand {
  static description = `
    Where command.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'where';

  getWhereStatement(): [string, any] | void {
    return parseWhereString(this.commandMeta.params[0], this.queryMeta);
  }
}
