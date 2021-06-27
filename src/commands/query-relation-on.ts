import { CommandType } from 'src/command/query-command';
import { QueryRelationCommand } from 'src/command/query-relation-command';
import { parseWhereSql } from 'src/meta/query/parse-where-sql';

export class QueryModelOrderByCommand extends QueryRelationCommand {
  static description = `
    Relation on command.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_RELATION_COMMAND;

  static commandName = 'on';

  getWhereStatement(): [string, any] | void {
    return parseWhereSql(this.commandMeta, this.relationMeta);
  }
}
