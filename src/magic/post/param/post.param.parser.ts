import { JsonUnit } from '../../base/json-unit';
import { InstanceMetaCollection } from './instance.meta.colletion';

export class MagicPostParamsParser {
  private _json: any;
  private _entityMetas: InstanceMetaCollection[] = [];

  constructor(json: any) {
    this._json = json;
    for (const keyStr in this._json) {
      const value = this._json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      this._entityMetas.push(new InstanceMetaCollection(jsonUnit.key, jsonUnit));
    }
    console.debug('MagicPostParamsParser', this._entityMetas);
  }

  get entityMetas() {
    return this._entityMetas;
  }
}
