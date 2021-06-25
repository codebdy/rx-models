import { CommandMeta } from 'src/command/command.meta';
import { CommandType } from 'src/command/query-command';
import { SelectQueryBuilder } from 'typeorm';

export class QueryRelationTakeCommand {
  static description = `
    Magic query command, set take(count) to QueryBuilder.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_RELATION_COMMAND;

  static commandName = 'take';

  constructor(private readonly commandMeta: CommandMeta) {}

  get params() {
    return this.commandMeta.params;
  }

  get count() {
    return this.commandMeta.getFistNumberParam();
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    qb.take(this.count);
    return qb;
  }
}
