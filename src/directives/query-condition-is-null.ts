import { DirectiveType } from 'src/directive/directive-type';
import { QueryConditionDirective } from 'src/directive/query/query.condition-directive';

export class QueryConditionIsNullDirective extends QueryConditionDirective {
  static description = `Condition isNull directive.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_CONDITION_DIRECTIVE;

  static directiveName = 'isNull';

  getAndWhereStatement(): [string, any] {
    return [`${this.field} IS NULL `, {}];
  }
}
