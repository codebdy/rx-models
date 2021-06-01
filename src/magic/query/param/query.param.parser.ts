import { JsonUnit } from './json-unit';
import { ModelUnit } from './model-unit';
import { ModelParams } from './model-params';

export class MagicQueryParamsParser {
  private _json: any;
  private _modelUnit: ModelUnit;
  private _modelParams: ModelParams;

  constructor(jsonStr: string) {
    this._json = JSON.parse(jsonStr || '{}');
    for (const keyStr in this._json) {
      const value = this._json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      //console.log(jsonUnit);
      if (jsonUnit.isModel()) {
        this._modelUnit = new ModelUnit(jsonUnit);
        delete this._json[keyStr];
        break;
      }
    }
    this._modelParams = new ModelParams(this._json);
  }

  get modelUnit() {
    return this._modelUnit;
  }

  get relations() {
    return this._modelParams.relations;
  }

  get select() {
    return this._modelParams.select;
  }

  get orderBys() {
    return this._modelParams.orderBys;
  }

  get relationFilters() {
    return this._modelParams.relationFilters;
  }

  get whereMeta() {
    return this._modelParams.whereMeta;
  }
}
