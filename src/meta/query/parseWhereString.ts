import { createId } from 'src/util/create-id';
import { QueryMeta } from './query-meta';
import { RelationMeta } from './relation-meta';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SqlWhereParser = require('sql-where-parser');
const OPERATOR_UNARY_MINUS = Symbol('-');

export function parseWhereString(
  sqlStr: string,
  rootMeta: QueryMeta | RelationMeta,
): [string, any] {
  if (!this.commandMeta.params || this.commandMeta.params.length === 0) {
    throw new Error('Not assign param to where command');
  }

  //const sql =
  //  "(name = 'Shaun Persad' AND age >= 27) OR (name like '%xx%' and id in (1,2,3,4))";
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
        let modelAlias = rootMeta.alias;
        if (arr.length > 1) {
          const relation = rootMeta.findOrRepairRelation(arr[0]);
          if (relation) {
            operands[0] = arr[1];
            modelAlias = relation.alias;
          }
        }
        operands[0] = `${modelAlias}.${operands[0]}`;
        params[paramName] = operands[1];
        if (operatorValue === 'IN') {
          return `${operands[0]} ${operatorValue} (:...${paramName})`;
        }
        return `${operands[0]} ${operatorValue} :${paramName}`;
    }
  };

  const parsed = parser.parse(sqlStr, evaluator);

  return [parsed, params];
}
