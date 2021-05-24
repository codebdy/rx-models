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
    for (const condition of this._conditions) {
      const paramName = `param${paramIndex}`;
      whereRaw =
        whereRaw +
        `${whereRaw ? '&' : ''} ${condition.field} ${
          condition.operator
        } :${paramName}`;
      params[paramName] = condition.value;
      paramIndex++;
    }
    return [whereRaw, params];
  }
}
