import { CommandType } from 'src/command/query-command';
import { QueryRelationCommand } from 'src/command/query-relation-command';
import { parseWhereString } from 'src/meta/query/parseWhereString';

export class QueryModelOrderByCommand extends QueryRelationCommand {
  static description = `
    Relation on command.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_RELATION_COMMAND;

  static commandName = 'on';

  get params() {
    return this.commandMeta.params;
  }

  getWhereStatement(): [string, any] | void {
    return parseWhereString(this.commandMeta.params[0], this.relationMeta);
  }
}
