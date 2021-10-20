import { DirectiveType } from 'src/directive/directive-type';
import { QueryRelationDirective } from 'src/directive/query/query.relation-directive';
import { parseOnSql } from 'src/magic-meta/query/parse-on-sql';

export class QueryModelOrderByDirective extends QueryRelationDirective {
  static description = `
    Relation on directive.
    该指令目前不能正常使用。
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_RELATION_DIRECTIVE;

  static directiveName = 'on';

  getWhereStatement(): [string, any] | void {
    const sql = parseOnSql(this.directiveMeta.value, this.relationMeta);
    return [sql, {}];
  }
}
