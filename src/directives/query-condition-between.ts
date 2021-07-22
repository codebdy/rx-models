import { DirectiveType } from 'src/directive/directive-type';
import { QueryConditionDirective } from 'src/directive/query/query.condition-directive';
import { createId } from 'src/util/create-id';

export class QueryConditionBetweenDirective extends QueryConditionDirective {
  static description = `Condition between directive.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_CONDITION_DIRECTIVE;

  static directiveName = 'between';

  getWhereStatement(): [string, any] {
    const field = this.field;
    const value = this.value;
    if (!value || !value.length || value.length < 2) {
      throw new Error(
        `Field "${field}" value "${value}" can not be used to between directive`,
      );
    }
    const paramName1 = 'param' + createId();
    const paramName2 = 'param' + createId();
    return [
      `${field} BETWEEN (:${paramName1} AND :${paramName2}) `,
      {
        [paramName1]: value[0],
        [paramName2]: value[1],
      },
    ];
  }
}
