import { createId } from 'src/utils/create-id';
import { SelectQueryBuilder } from 'typeorm';
import { Condition } from './condition';

export class Where {
  private _conditions: Condition[] = [];
  private _andMetas: Where[];
  private _orMetas: Where[];

  get conditions() {
    return this._conditions;
  }

  makeQueryBuilder(
    qb: SelectQueryBuilder<any>,
    modelAlias: string,
  ): SelectQueryBuilder<any> {
    const [whereString, whereParams] = this.getWhereStatement(modelAlias);
    console.log('Where where:', whereString, whereParams);
    return qb.where(whereString, whereParams);
  }

  addCondition(condition: Condition) {
    this._conditions.push(condition);
  }

  getWhereStatement(modelAlias: string): [string, any] {
    let whereRaw = '';
    const params = {};
    for (const condition of this._conditions) {
      const paramName = `param${createId()}`;
      whereRaw =
        whereRaw +
        `${whereRaw ? '&' : ''} ${modelAlias}.${condition.field} ${
          condition.operator
        } :${paramName}`;
      params[paramName] = condition.value;
    }
    return [whereRaw, params];
  }
}
