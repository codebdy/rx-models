import { JsonUnit } from 'src/magic/base/json-unit';
import { EntityMeta } from './entity.meta';

export class EntityMetaCollection {
  private _entities: EntityMeta[] = [];
  private _jsonUnit: JsonUnit;
  constructor(jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
    if (Array.isArray(jsonUnit.value)) {
      for (const meta of jsonUnit.value) {
        this._entities.push(new EntityMeta(jsonUnit.key, meta));
      }
    } else {
      this._entities.push(new EntityMeta(jsonUnit.key, jsonUnit.value));
    }
  }

  get model() {
    return this._jsonUnit.key;
  }

  get commands() {
    return this._jsonUnit.commands;
  }
}
