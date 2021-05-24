import { ConditionMeta } from './condition-meta';

export class WhereMeta {
  private _conditions: ConditionMeta[] = [];
  private _andMetas: WhereMeta[];
  private _orMetas: WhereMeta[];

  get conditions() {
    return this._conditions;
  }

  addCondition(condition: ConditionMeta) {
    this._conditions.push(condition);
  }

  getWhereStatement(): [string, any] {
    let whereRaw = '';
    const params = {};
    let paramIndex = 1;
    for (let i = 0; i < this._conditions.length; i++) {
      const condition = this._conditions[i];
      const paramName = `param${paramIndex}`;
      whereRaw =
        whereRaw +
        `${i > 0 ? '&' : ''} ${condition.field} ${
          condition.operator
        } :${paramName}`;
      params[paramName] = condition.value;
      paramIndex++;
    }
    return [whereRaw, params];
  }
}
