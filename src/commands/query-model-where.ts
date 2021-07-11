import { QueryCommand } from 'src/command/query/query.command';
import { CommandType } from 'src/command/command-type';
import { parseWhereSql } from 'src/magic-meta/query/parse-where-sql';

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
