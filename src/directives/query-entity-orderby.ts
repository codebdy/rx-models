import { QueryDirective } from 'src/directive/query/query.directive';
import { DirectiveType } from 'src/directive/directive-type';
import { SelectQueryBuilder } from 'typeorm';

export class QueryEntityOrderByDirective extends QueryDirective {
  static description = `
    Magic query directive, orderBy directive, to sort the result.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_ENTITY_DIRECTIVE;

  static directiveName = 'orderBy';

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    const orderMap = this.getpMap();
    if (orderMap) {
      qb.orderBy(orderMap);
    }
    return qb;
  }

  getpMap() {
    const orderMap = {} as any;
    if (!this.directiveMeta.value) {
      throw new Error('Not assign params to "select" command');
    }
    const orderBy = this.directiveMeta.value;
    for (const key in orderBy) {
      orderMap[`${this.rootMeta.alias}.${key}`] = orderBy[key];
    }
    return orderMap;
  }
}
