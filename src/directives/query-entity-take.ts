import { QueryDirective } from 'src/directive/query/query.directive';
import { DirectiveType } from 'src/directive/directive-type';
import { SelectQueryBuilder } from 'typeorm';

export class QueryEntityTakeDirective extends QueryDirective {
  static description = `
    Magic query directive, set take(count) to QueryBuilder.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_ENTITY_DIRECTIVE;

  static directiveName = 'take';

  isEffectResultCount = true;

  get count() {
    return this.directiveMeta.value;
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    qb.take(this.count);
    return qb;
  }
}
