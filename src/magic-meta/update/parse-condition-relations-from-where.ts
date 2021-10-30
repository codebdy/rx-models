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

  const parser = new SqlWhereParser();
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
      arr.splice(0, arr?.length - 1);
      const roleName = arr.join('.');
      addRelation(roleName, rootMeta, schemaService);
    }
  };

  parser.parse(sql, evaluator);
}

function addRelation(
  relationString: string,
  parentMeta: UpdateEntityOrRelationMeta,
  schemaService: SchemaService,
) {
  const [relationName, ...leftStrArr] = relationString.split('.');
  const leftString = leftStrArr.join('.');
  const entityMetaOfRelation = schemaService.getRelationEntityMetaOrFailed(
    relationName,
    parentMeta.entity,
  );
  let relation = parentMeta.findRelation(relationName);
  if (!relation) {
    relation = new UpdateEntityOrRelationMeta(entityMetaOfRelation);
    relation.roleName = relationName;
    parentMeta.relations.push(relation);
  }
  if (leftString) {
    addRelation(leftString, relation, schemaService);
  }
}
