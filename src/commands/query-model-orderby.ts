import { QueryCommand } from 'src/command/query/query.command';
import { CommandType } from 'src/command/command-type';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelOrderByCommand extends QueryCommand {
  static description = `
    Magic query command, orderBy command, to sort the result.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'orderBy';

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    const orderMap = this.getpMap();
    if (orderMap) {
      qb.orderBy(orderMap);
    }
    return qb;
  }

  getpMap() {
    const orderMap = {} as any;
    if (!this.commandMeta.value) {
      throw new Error('Not assign params to "select" command');
    }
    const orderBy = this.commandMeta.value;
    for (const key in orderBy) {
      orderMap[`${this.rootMeta.alias}.${key}`] = orderBy[key];
    }
    return orderMap;
  }
}
