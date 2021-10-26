import { DirectiveType } from 'src/directive/directive-type';
import { QueryRelationDirective } from 'src/directive/query/query.relation-directive';
//import { parseOnSql } from 'src/magic-meta/query/parse-on-sql';

export class QueryModelWhereDirective extends QueryRelationDirective {
  static description = `
    Relation where directive.
    本方法暂未实现
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_RELATION_DIRECTIVE;

  static directiveName = 'where';

  //getAndWhereStatement(): [string, any] | void {
    //const sql = parseOnSql(this.directiveMeta.value, this.relationMeta);
  //  return [sql, {}];
  //}
}
