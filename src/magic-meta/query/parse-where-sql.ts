import { RxUser } from 'src/entity-interface/RxUser';
import { createId } from 'src/util/create-id';
import { QueryEntityMeta } from './query.entity-meta';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SqlWhereParser = require('sql-where-parser');
const OPERATOR_UNARY_MINUS = Symbol('-');

export function parseWhereSql(
  sql: string,
  ownerMeta: QueryEntityMeta,
  me: RxUser,
): [string, any] {
  if (!sql) {
    throw new Error('Not assign sql statement to where command or expression');
  }

  const parser = new SqlWhereParser();
  const params = {} as any;
  const evaluator = (operatorValue, operands) => {
    if (operatorValue === OPERATOR_UNARY_MINUS) {
      operatorValue = '-';
    }
    if (operatorValue === ',') {
      return [].concat(operands[0], operands[1]);
    }

    const paramName = `param${createId()}`;

    switch (operatorValue) {
      case 'OR':
        return `(${operands.join(' OR ')})`;
      case 'AND':
        return `(${operands.join(' AND ')})`;
      default:
        const arr = operands[0].split('.');
        let modelAlias = ownerMeta.alias;
        if (arr.length > 1) {
          const relation = ownerMeta.findRelatiOrFailed(arr[0]);
          if (relation) {
            operands[0] = arr[1];
            modelAlias = relation.alias;
          }
        }
        operands[0] = `${modelAlias}.${operands[0]}`;
        if ((operands[1] as string).startsWith('$me.')) {
          const [, columnStr] = (operands[1] as string).split('.');
          params[paramName] = me[columnStr];
        } else {
          params[paramName] = operands[1];
        }

        if (operatorValue === 'IN') {
          return `${operands[0]} ${operatorValue} (:...${paramName})`;
        }
        return `${operands[0]} ${operatorValue} :${paramName}`;
    }
  };

  const parsed = parser.parse(sql, evaluator);

  return [parsed, params];
}
