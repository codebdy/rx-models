import { QueryCommand, CommandType } from 'src/command/query/query.command';
import { parseWhereSql } from 'src/meta/query/parse-where-sql';

export class QueryModelWhereCommand extends QueryCommand {
  static description = `
    Where command.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'where';

  getWhereStatement(): [string, any] | void {
    return parseWhereSql(this.commandMeta, this.rootMeta);
  }
}
