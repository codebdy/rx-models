import { createId } from 'src/utils/create-id';
import { Condition } from './condition';

export class Where {
  private _conditions: Condition[] = [];
  private _andMetas: Where[];
  private _orMetas: Where[];

  get conditions() {
    return this._conditions;
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
