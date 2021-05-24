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
}
