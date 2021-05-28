import { JsonUnit } from './json-unit';
import { ModelUnit } from './model-unit';
import { Relation } from './relation';
import { TOKEN_MODEL } from './keyword_tokens';
import { Where } from './where';
import { Condition } from './condition';
import { OrderBy } from './order-by';

export class MagicQueryParamsParser {
  private _json: any;
  private _modelUnit: ModelUnit;
  private _relations: Relation[] = [];
  private _select: string[] = [];
  private _orderBys: OrderBy;
  whereMeta: Where = new Where();

  constructor(jsonStr: string) {
    this._json = JSON.parse(jsonStr || '{}');
    for (const keyStr in this._json) {
      const value = this._json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      //console.log(jsonUnit);
      if (jsonUnit.key.toLowerCase() === TOKEN_MODEL) {
        this._modelUnit = new ModelUnit(jsonUnit);
      } else if (jsonUnit.isRlationShip()) {
        this._relations.push(new Relation(jsonUnit));
      } else if (jsonUnit.isSelect()) {
        this._select = jsonUnit.value;
      } else if (jsonUnit.isOrderBy()) {
        this._orderBys = new OrderBy(jsonUnit.value);
      } else {
        this.whereMeta.addCondition(new Condition(keyStr, value));
      }
    }
  }

  get modelUnit() {
    return this._modelUnit;
  }

  get takeCommand() {
    return this._modelUnit.getTakeCommand;
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
