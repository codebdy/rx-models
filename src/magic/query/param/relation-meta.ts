import { JsonUnitMeta } from './json-unit-meta';
import { WhereMeta } from './where-meta';

export class RelationMeta {
  private _jsonUnit: JsonUnitMeta;

  model: string;
  relations: RelationMeta[];
  whereMeta: WhereMeta;
  constructor(jsonUnit: JsonUnitMeta) {
    this._jsonUnit = jsonUnit;
  }

  get name(){
    return this._jsonUnit.key;
  }
}
