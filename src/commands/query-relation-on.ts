import { CommandType } from 'src/command/command-type';
import { QueryRelationCommand } from 'src/command/query/query.relation-command';
import { parseWhereSql } from 'src/magic-meta/query/parse-where-sql';

export class QueryModelOrderByCommand extends QueryRelationCommand {
  static description = `
    Relation on command.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_RELATION_COMMAND;

  static commandName = 'on';

  getWhereStatement(): [string, any] | void {
    return parseWhereSql(
      this.commandMeta.value,
      this.relationMeta,
      this.magicService.me,
    );
  }
}
