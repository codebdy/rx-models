import { getRelationModel } from 'src/magic/base/getRelationModel';
import { JsonUnit } from 'src/magic/base/json-unit';
import { createId } from 'src/utils/create-id';
import { SelectQueryBuilder } from 'typeorm';
import { Condition } from './condition';
import { Relation } from './relation';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SqlWhereParser = require('sql-where-parser');
const OPERATOR_UNARY_MINUS = Symbol('-');

export class Where {
  private _conditions: Condition[] = [];
  private _whereString = '';
  private _modelAlias: string;
  private _relations: Relation[] = [];
  private _model = '';

  constructor(model: string, modelAlias: string) {
    this._modelAlias = modelAlias;
    this._model = model;
  }

  set relations(relatons: Relation[]) {
    this._relations = relatons || [];
  }

  set whereString(whereString: string) {
    this._whereString = whereString;
  }

  get conditions() {
    return this._conditions;
  }

  //relations会被修改
  discriminateConditionsThatBelongsToRelation() {
    for (const condition of this._conditions) {
      const relationName = condition.belongsToRelationName;
      const relation = this.discriminateOneRelation(relationName);
      relationName && (condition.relationAlias = relation.alias);
    }
  }

  //relations会被修改
  private discriminateOneRelation(relationName: string) {
    const relatons = this._relations;
    let relation = relatons.find((relation) => relation.name === relationName);
    if (relationName && !relation) {
      const relationModel = getRelationModel(relationName, this._model);
      relation = new Relation(
        relationModel,
        new JsonUnit(relationName, {}),
        this._model,
        this._modelAlias,
      );
      relatons.push(relation);
    }
    return relation;
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    this.discriminateConditionsThatBelongsToRelation();
    const [whereString, whereParams] = this.getWhereStatement();
    console.debug('Where:', whereString, whereParams);
    return qb.where(whereString, whereParams);
  }

  addCondition(condition: Condition) {
    this._conditions.push(condition);
  }

  getWhereStatement(): [string, any] {
    let whereRaw = '';
    const params = {};
    for (const condition of this._conditions) {
      const paramName = `param${createId()}`;
      whereRaw =
        whereRaw +
        `${whereRaw ? ' AND ' : ''} ${condition.field} ${
          condition.operator
        } :${paramName}`;
      params[paramName] = condition.value;
    }
    const [whereRaw2, params2] = this.parseWhereString();
    return [whereRaw + whereRaw2, { ...params, ...params2 }];
  }

  parseWhereString(): [string, any] {
    if (!this._whereString) {
      return ['', {}];
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
          let modelAlias = this._modelAlias;
          if (arr.length > 1) {
            const relation = this.discriminateOneRelation(arr[0]);
            if (relation) {
              operands[0] = arr[1];
              modelAlias = relation.alias;
            }
          }
          operands[0] = `${modelAlias}.${operands[0]}`;
          params[paramName] = operands[1];
          return `${operands[0]} ${operatorValue} :${paramName}`;
      }
    };

    const parsed = parser.parse(this._whereString, evaluator);

    return [parsed, params];
  }
}
