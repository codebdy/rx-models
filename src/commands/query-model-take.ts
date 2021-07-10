import { QueryCommand, CommandType } from 'src/command/query/query.command';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelTakeCommand extends QueryCommand {
  static description = `
    Magic query command, set take(count) to QueryBuilder.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

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
