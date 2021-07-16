// eslint-disable-next-line @typescript-eslint/no-var-requires
const SqlWhereParser = require('sql-where-parser');
const OPERATOR_UNARY_MINUS = Symbol('-');

export function parseRelationsFromWhereSql(sql: string): string[] {
  if (!sql) {
    throw new Error('Not assign sql statement to where command or expression');
  }

  const parser = new SqlWhereParser();
  const relationNames: string[] = [];
  const evaluator = (operatorValue, operands) => {
    if (operatorValue === OPERATOR_UNARY_MINUS) {
      operatorValue = '-';
    }
    if (operatorValue === ',') {
      return [].concat(operands[0], operands[1]);
    }

    const arr = operands[0].split('.');
    if (arr.length > 1) {
      relationNames.push(arr[0]);
    }
  };

  parser.parse(sql, evaluator);

  return relationNames;
}
