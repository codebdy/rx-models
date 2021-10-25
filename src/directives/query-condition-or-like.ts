import { DirectiveType } from 'src/directive/directive-type';
import { QueryConditionDirective } from 'src/directive/query/query.condition-directive';
import { createId } from 'src/util/create-id';

export class QueryConditionOrLikeDirective extends QueryConditionDirective {
  static description = `Condition orLike irective.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_CONDITION_DIRECTIVE;

  static directiveName = 'orLike';

  getOrWhereStatement(): [string, any] | void {
    const paramName = 'param' + createId();
    console.log('getOrWhereStatement 被调用');
    return [
      `${this.field} LIKE :${paramName} `,
      {
        [paramName]: this.value,
      },
    ];
  }
}
