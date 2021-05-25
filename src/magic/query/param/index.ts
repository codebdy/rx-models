import { JsonUnitMeta } from './json-unit-meta';
import { ModelUnitMeta } from './model-unit-meta';
import { RelationMeta } from './relation-meta';
import { TOKEN_MODEL } from './keyword_tokens';
import { WhereMeta } from './where-meta';
import { ConditionMeta } from './condition-meta';
import { OrderByMeta } from './order-by-meta';

export class MagicQueryParamsParser {
  private _json: any;
  private _modelUnit: ModelUnitMeta;
  private _relations: RelationMeta[] = [];
  private _select: string[] = [];
  private _orderBys: OrderByMeta;
  whereMeta: WhereMeta = new WhereMeta();

  constructor(jsonStr: string) {
    this._json = JSON.parse(jsonStr || '{}');
    for (const keyStr in this._json) {
      const value = this._json[keyStr];
      const jsonUnit = new JsonUnitMeta(keyStr, value);
      //console.log(jsonUnit);
      if (jsonUnit.key.toLowerCase() === TOKEN_MODEL) {
        this._modelUnit = new ModelUnitMeta(jsonUnit);
      } else if (jsonUnit.isRlationShip()) {
        this._relations.push(new RelationMeta(jsonUnit));
      } else if (jsonUnit.isSelect()) {
        this._select = jsonUnit.value;
      } else if (jsonUnit.isOrderBy()) {
        this._orderBys = new OrderByMeta(jsonUnit.value);
      } else {
        this.whereMeta.addCondition(new ConditionMeta(keyStr, value));
      }
    }
  }

  get modelUnit() {
    return this._modelUnit;
  }

  get takeCommand() {
    return this._modelUnit.takeCommand;
  }

  get relations() {
    return this._relations;
  }

  get select() {
    return this._select;
  }

  get orderBys() {
    return this._orderBys;
  }
}
