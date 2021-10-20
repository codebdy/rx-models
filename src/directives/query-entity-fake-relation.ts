import { QueryDirective } from 'src/directive/query/query.directive';
import { DirectiveType } from 'src/directive/directive-type';
import { QueryResult } from 'src/magic-meta/query/query-result';

export class QueryEntityFakeRelationDirective extends QueryDirective {
  static description = `
    Magic query directive, @fakeRelation.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_ENTITY_DIRECTIVE;

  static directiveName = 'fakeRelation';

  async filterResult(result: QueryResult) {
    return result;
  }
}
