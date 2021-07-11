import { QueryCommand } from 'src/command/query/query.command';
import { CommandType } from 'src/command/command-type';
import { SelectQueryBuilder } from 'typeorm';

export class QueryEntityTakeCommand extends QueryCommand {
  static description = `
    Magic query command, set take(count) to QueryBuilder.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_ENTITY_COMMAND;

  static commandName = 'take';

  isEffectResultCount = true;

  get count() {
    return this.commandMeta.value;
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    qb.take(this.count);
    return qb;
  }
}
