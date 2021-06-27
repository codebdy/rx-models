import { CommandType, QueryCommand } from 'src/command/query-command';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelOrderByCommand extends QueryCommand {
  static description = `
    Magic query command, orderBy command, to sort the result.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'orderBy';

  get params() {
    return this.commandMeta.params;
  }

  get count() {
    return this.commandMeta.getFistNumberParam();
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    const orderMap = this.getpMap();
    if (orderMap) {
      qb.addOrderBy(orderMap);
    }
    return qb;
  }

  getpMap() {
    const orderMap = {} as any;
    if (!this.commandMeta.params || this.commandMeta.params.length === 0) {
      throw new Error('Not assign params to "select" command');
    }
    const orderBy = this.commandMeta.params[0] as any;
    for (const key in orderBy) {
      orderMap[`${this.rootMeta.alias}.${key}`] = orderBy[key];
    }
    return orderMap;
  }
}
