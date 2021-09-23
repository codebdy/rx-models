import { DirectiveType } from 'directive/directive-type';
import { QueryRelationDirective } from 'directive/query/query.relation-directive';
import { QueryResult } from 'magic-meta/query/query-result';
import { SelectQueryBuilder } from 'typeorm';

export class QueryRelationCountDirective extends QueryRelationDirective {
  static description = `Magic query directive, set relation count map to QueryBuilder.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_RELATION_DIRECTIVE;

  static directiveName = 'count';

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    //queryBulider.loadRelationCountAndMap(
    //  `${paramParser.modelUnit?.modelAlias}.relationCount`,
    //  `${paramParser.modelUnit?.modelAlias}.roles`,
    //);
    return qb;
  }

  filterResult(result: QueryResult): QueryResult {
    throw new Error('Method not implemented.');
  }
}
