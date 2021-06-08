import { JsonUnit } from '../../base/json-unit';
import { EntityMeta } from './entity.meta';

export class MagicPostParamsParser {
  private _json: any;
  private _entityMetas: EntityMeta[] = [];

  constructor(json: any) {
    this._json = json;
    for (const keyStr in this._json) {
      const value = this._json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      this._entityMetas.push(new EntityMeta(jsonUnit));
    }
  }

  get entityMetas() {
    return this._entityMetas;
  }
}
