import { JsonUnitMeta } from './json-unit-meta';

export class RelationMeta {
  private _jsonUnit: JsonUnitMeta;

  //relations: RelationMeta[];
  //whereMeta: WhereMeta;
  constructor(jsonUnit: JsonUnitMeta) {
    this._jsonUnit = jsonUnit;
  }

  get name() {
    return this._jsonUnit.key;
  }
}
