import { DirectiveType } from 'directive/directive-type';
import { QueryConditionDirective } from 'directive/query/query.condition-directive';
import { createId } from 'util/create-id';

export class QueryConditionEqualDirective extends QueryConditionDirective {
  static description = `Condition like irective.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_CONDITION_DIRECTIVE;

  static directiveName = 'like';

  getWhereStatement(): [string, any] {
    const paramName = 'param' + createId();
    return [
      `${this.field} LIKE :${paramName} `,
      {
        [paramName]: this.value,
      },
    ];
  }
}
