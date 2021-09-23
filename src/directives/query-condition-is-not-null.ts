import { DirectiveType } from 'directive/directive-type';
import { QueryConditionDirective } from 'directive/query/query.condition-directive';

export class QueryConditionEqualDirective extends QueryConditionDirective {
  static description = `Condition isNotNull directive.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_CONDITION_DIRECTIVE;

  static directiveName = 'isNotNull';

  getWhereStatement(): [string, any] {
    //const paramName = 'param' + createId();
    //const paramValue = this.value;
    return [`${this.field} IS NOT NULL `, {}];
  }
}
