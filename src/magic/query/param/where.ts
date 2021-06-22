import { getRelationModel } from 'src/magic/base/getRelationModel';
import { JsonUnit } from 'src/magic/base/json-unit';
import { createId } from 'src/utils/create-id';
import { SelectQueryBuilder } from 'typeorm';
import { Condition } from './condition';
import { Relation } from './relation';

export class Where {
  private _conditions: Condition[] = [];
  private _whereString = '';

  set whereString(whereString: string) {
    this._whereString = whereString;
  }

  get conditions() {
    return this._conditions;
  }

  //relations会被修改
  discriminateConditionsThatBelongsToRelation(relatons: Relation[]) {
    for (const condition of this._conditions) {
      let relation = relatons.find(
        (relation) => relation.name === condition.belongsToRelationName,
      );
      if (condition.belongsToRelationName && !relation) {
        const relationModel = getRelationModel(
          condition.belongsToRelationName,
          condition.model,
        );
        relation = new Relation(
          relationModel,
          new JsonUnit(condition.belongsToRelationName, {}),
          condition.model,
          condition.modelAlias,
        );
        relatons.push(relation);
      }
      condition.belongsToRelationName &&
        (condition.relationAlias = relation.alias);
    }
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
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
        `${whereRaw ? '&' : ''} ${condition.field} ${
          condition.operator
        } :${paramName}`;
      params[paramName] = condition.value;
    }
    return [whereRaw, params];
  }
}
