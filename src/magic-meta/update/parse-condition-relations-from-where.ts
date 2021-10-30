import { SchemaService } from 'src/schema/schema.service';
import { UpdateEntityOrRelationMeta } from './update.entity-or-relation-meta';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SqlWhereParser = require('sql-where-parser');
const OPERATOR_UNARY_MINUS = Symbol('-');

export function parseUpdateRelationsFromWhere(
  rootMeta: UpdateEntityOrRelationMeta,
  sql: string,
  schemaService: SchemaService,
) {
  if (!sql) {
    throw new Error(
      'Not assign sql statement to where directive or expression',
    );
  }

  //const rootMeta = new UpdateEntityOrRelationMeta();

  const parser = new SqlWhereParser();
  //const relations: AddonRelationInfo[] = [];
  const evaluator = (operatorValue, operands) => {
    if (operatorValue === OPERATOR_UNARY_MINUS) {
      operatorValue = '-';
    }
    if (operatorValue === ',') {
      return [].concat(operands[0], operands[1]);
    }

    if (operatorValue === 'NOT') {
      return 'NOT ' + operands[0];
    }

    const arr = operands[0]?.split('.');
    if (arr?.length > 1) {
      const [relationName, fieldName] = arr;
      /*const relation = relations.find(
        (relation) => relation.name === relationName,
      );
      if (relation) {
        relation.fields.push(fieldName);
      } else {
        relations.push({ name: relationName, fields: [fieldName] });
      }*/
    }
  };

  parser.parse(sql, evaluator);

  return undefined;
}
