import { CommandType } from 'src/command/query-command';
import { QueryRelationCommand } from 'src/command/query-relation-command';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelOrderByCommand extends QueryRelationCommand {
  static description = `
    Magic query command, relation orderBy command, to sort the relation.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_RELATION_COMMAND;

  static commandName = 'orderBy';

  get params() {
    return this.commandMeta.params;
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    const orderMap = this.getpMap();
    if (orderMap) {
      qb.orderBy(orderMap);
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
      orderMap[`${this.relationMeta.alias}.${key}`] = orderBy[key];
    }
    return orderMap;
  }
}
