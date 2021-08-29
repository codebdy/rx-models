import { isString } from 'lodash';
import { DirectiveType } from 'src/directive/directive-type';
import { QueryRelationDirective } from 'src/directive/query/query.relation-directive';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelOrderByDirective extends QueryRelationDirective {
  static description = `
    Magic query directive, relation orderBy directive, to sort the relation.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_RELATION_DIRECTIVE;

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
      throw new Error('Not assign params to "select" directive');
    }
    const orderBy = this.directiveMeta.value as any;
    if (isString(orderBy)) {
      throw new Error('Orderby syntax error:' + orderBy);
    }
    for (const key in orderBy) {
      orderMap[`${this.relationMeta.alias}.${key}`] = orderBy[key];
    }
    return orderMap;
  }
}
