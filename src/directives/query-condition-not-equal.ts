import { DirectiveType } from 'src/directive/directive-type';
import { QueryConditionDirective } from 'src/directive/query/query.condition-directive';
import { createId } from 'src/util/create-id';

export class QueryConditionEqualDirective extends QueryConditionDirective {
  static description = `Condition not equal directive.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_CONDITION_DIRECTIVE;

  static directiveName = '!=';

  getWhereStatement(): [string, any] {
    const paramName = 'param' + createId();
    let paramValue = this.value;
    if (this.value?.toString().startsWith('$me.')) {
      const [, columnStr] = (this.value as string).split('.');
      paramValue = this.magicService.me[columnStr];
    }
    return [
      `${this.field} != :${paramName} `,
      {
        [paramName]: paramValue,
      },
    ];
  }
}
