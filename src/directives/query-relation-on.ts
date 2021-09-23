import { DirectiveType } from 'src/directive/directive-type';
import { QueryRelationDirective } from 'src/directive/query/query.relation-directive';
import { parseWhereSql } from 'src/magic-meta/query/parse-where-sql';

export class QueryModelOrderByDirective extends QueryRelationDirective {
  static description = `
    Relation on directive.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_RELATION_DIRECTIVE;

  static directiveName = 'on';

  getWhereStatement(): [string, any] | void {
    return parseWhereSql(
      this.directiveMeta.value,
      this.relationMeta,
      this.magicService.me,
    );
  }
}
