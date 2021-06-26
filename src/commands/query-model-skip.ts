import { CommandType, QueryCommand } from 'src/command/query-command';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelSkipCommand extends QueryCommand {
  static description = `
    Magic query command, set skip(count) to QueryBuilder.
  `;
  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'skip';

  isEffectResultCount = true;

  get params() {
    return this.commandMeta.params;
  }

  get count() {
    return this.commandMeta.getFistNumberParam();
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    qb.skip(this.count);
    return qb;
  }
}
