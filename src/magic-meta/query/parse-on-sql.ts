import { QueryRelationMeta } from './query.relation-meta';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SqlWhereParser = require('sql-where-parser');
const OPERATOR_UNARY_MINUS = Symbol('-');

export function parseOnSql(
  sql: string,
  relationMeta: QueryRelationMeta,
): string {
  if (!sql) {
    throw new Error(
      'Not assign sql statement to where directive or expression',
    );
  }
  const ownerMeta = relationMeta.parentEntityMeta;
  const parser = new SqlWhereParser();
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
          const relation = ownerMeta.findRelatiOrFailed(arr[0]);
          if (relation) {
            operands[0] = arr[1];
            modelAlias = relation.alias;
          } else if (relationMeta.name === arr[0]) {
            operands[0] = arr[1];
            modelAlias = relationMeta.alias;
          }
        }
        operands[0] = `${modelAlias}.${operands[0]}`;
        const arr2 = operands[1]?.split('.');
        if (arr2 && arr2.length > 1) {
          const relation = ownerMeta.findRelatiOrFailed(arr2[0]);
          if (relation) {
            operands[1] = arr2[1];
            modelAlias = relation.alias;
          } else if (relationMeta.name === arr2[0]) {
            operands[1] = arr2[1];
            modelAlias = relationMeta.alias;
          }
        }
        operands[1] = `${modelAlias}.${operands[1]}`;
        if (operatorValue === 'IN') {
          throw new Error('Can not use IN operator in @on directive');
        }
        return `${operands[0]} ${operatorValue} ${operands[1]}`;
    }
  };

  const parsed = parser.parse(sql, evaluator);

  return parsed;
}
