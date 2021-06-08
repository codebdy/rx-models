import { JsonUnit } from '../../base/json-unit';

export class MagicPostParamsParser {
  private _json: any;

  constructor(jsonStr: string) {
    this._json = JSON.parse(jsonStr || '{}');
    for (const keyStr in this._json) {
      const value = this._json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      //console.log(jsonUnit);
      if (jsonUnit.isModel()) {
        //this._modelUnit = new ModelUnit(jsonUnit);
        delete this._json[keyStr];
        break;
      }
    }
    //this._modelParams = new ModelParams(this._json);
  }

}
