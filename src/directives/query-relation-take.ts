import { DirectiveType } from 'src/directive/directive-type';
import { QueryRelationDirective } from 'src/directive/query/query.relation-directive';
import { SelectQueryBuilder } from 'typeorm';

export class QueryRelationTakeDirective extends QueryRelationDirective {
  static description = `Magic query directive, set take(count) to QueryBuilder.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_RELATION_DIRECTIVE;

  static directiveName = 'take';

  get count() {
    return this.directiveMeta.value;
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    qb.take(this.count);
    return qb;
  }
}
