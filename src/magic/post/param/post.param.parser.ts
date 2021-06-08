import { JsonUnit } from '../../base/json-unit';
import { EntityMetaCollection } from './entity.meta.colletion';

export class MagicPostParamsParser {
  private _json: any;
  private _entityMetas: EntityMetaCollection[] = [];

  constructor(json: any) {
    this._json = json;
    for (const keyStr in this._json) {
      const value = this._json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      this._entityMetas.push(new EntityMetaCollection(jsonUnit.key, jsonUnit));
    }
  }

  get entityMetas() {
    return this._entityMetas;
  }
}
