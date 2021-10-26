import { RxUser } from 'src/entity-interface/RxUser';
import { createId } from 'src/util/create-id';
import { QueryEntityMeta } from './query.entity-meta';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SqlWhereParser = require('sql-where-parser');
const OPERATOR_UNARY_MINUS = Symbol('-');

const converValue = (value: any) => {
  if (typeof value == 'string') {
    if (value.toLowerCase() === 'false') {
      return false;
    }
    if (value.toLowerCase() === 'true') {
      return true;
    }
  }
  return value;
};

export function parseWhereSql(
  sql: string,
  ownerMeta: QueryEntityMeta,
  me: RxUser,
): [string, any] {
  if (!sql) {
    throw new Error(
      'Not assign sql statement to where directive or expression',
    );
  }

  const parser = new SqlWhereParser();
  const params = {} as any;
  const evaluator = (operatorValueOrg, operandsOrg) => {
    let operatorValue = operatorValueOrg;
    const operands = operandsOrg;
    if (operatorValue === OPERATOR_UNARY_MINUS) {
      operatorValue = '-';
    }
    if (operatorValue === ',') {
      return [].concat(operands[0], operands[1]);
    }

    if (operatorValue === 'NOT') {
      return { not: 'NOT ', value: operands[0] };
    }

    const paramName = `param${createId()}`;

    switch (operatorValue) {
      case 'OR':
        return `(${operands.join(' OR ')})`;
      case 'AND':
        return `(${operands.join(' AND ')})`;
      case 'IS':
        if (operands[1]?.not) {
          operatorValue = 'IS NOT';
          operands[1] = operands[1].value;
        }
      default:
        const arr = operands[0]?.split('.');
        let modelAlias = ownerMeta.alias;
        if (arr && arr.length > 1) {
          const relationName = arr.pop();
          const relation = ownerMeta.findRelatiOrFailed(arr.join('.'));
          if (relation) {
            operands[0] = relationName;
            modelAlias = relation.alias;
          }
        }
        operands[0] = `${modelAlias}.${operands[0]}`;
        if (operands[1]?.toString()?.startsWith('$me.')) {
          const [, columnStr] = (operands[1] as string)?.split('.');
          params[paramName] = me[columnStr];
        } else {
          params[paramName] = converValue(operands[1]);
        }

        if (operatorValue === 'IN') {
          return `${operands[0]} ${operatorValue} (:...${paramName})`;
        }

        if (operatorValue === 'LIKE') {
          return `LOWER(${operands[0]}) ${operatorValue} LOWER(:${paramName})`;
        }
        return `${operands[0]} ${operatorValue} :${paramName}`;
    }
  };

  const parsed = parser.parse(sql, evaluator);

  return [parsed, params];
}
