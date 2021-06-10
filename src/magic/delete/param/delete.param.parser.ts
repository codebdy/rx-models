import { JsonUnit } from '../../base/json-unit';
import { ModelDeleteMeta } from './model.delete.meta';
export class MagicDeleteParamsParser {
  private _json: any;
  private _deleteMetas: ModelDeleteMeta[] = [];

  constructor(json: any) {
    this._json = json;
    for (const keyStr in this._json) {
      const value = this._json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      this._deleteMetas.push(new ModelDeleteMeta(jsonUnit));
    }
    console.debug('MagicDeleteParamsParser', this._deleteMetas);
  }

  get deleteMetas() {
    return this._deleteMetas;
  }
}
