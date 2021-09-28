import { DirectiveType } from 'src/directive/directive-type';
import { QueryConditionDirective } from 'src/directive/query/query.condition-directive';
import { createId } from 'src/util/create-id';

export class QueryConditionBetweenDirective extends QueryConditionDirective {
  static description = `Condition in directive.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_CONDITION_DIRECTIVE;

  static directiveName = 'in';

  getWhereStatement(): [string, any] {
    const field = this.field;
    const value = this.value;
    if (!value) {
      throw new Error(
        `Field "${field}" value "${value}" can not be used to in directive`,
      );
    }
    const paramName = 'param' + createId();
    if (value.length === 0) {
      return [' false ', {}];
    }

    if (value.length === 1) {
      let paramValue = this.value;
      if (this.value?.toString().startsWith('$me.')) {
        const [, columnStr] = (this.value as string).split('.');
        paramValue = this.magicService.me[columnStr];
      }
      return [
        `${this.field} = :${paramName} `,
        {
          [paramName]: paramValue,
        },
      ];
    }

    return [
      `${field} IN (:...${paramName}) `,
      {
        [paramName]: value,
      },
    ];
  }
}
