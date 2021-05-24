import { JsonUnitMeta } from './json-unit-meta';

export class ModelUnitMeta {
  private _jsonUnit: JsonUnitMeta;

  constructor(jsonUnit: JsonUnitMeta) {
    this._jsonUnit = jsonUnit;
  }

  get model() {
    return this._jsonUnit.value;
  }

  get modelAlias() {
    return this.model?.toLowerCase();
  }
}
