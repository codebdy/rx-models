import { JsonUnit } from 'src/magic/base/json-unit';
import { EntityMeta } from './entity.meta';

export class EntityMetaCollection {
  private _entities: EntityMeta[] = [];
  private _jsonUnit: JsonUnit;
  private _model: string;
  constructor(model: string, jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
    this._model = model;
    if (Array.isArray(jsonUnit.value)) {
      for (const meta of jsonUnit.value) {
        this._entities.push(new EntityMeta(model, meta));
      }
    } else {
      this._entities.push(new EntityMeta(model, jsonUnit.value));
    }
  }

  get model() {
    return this._model;
  }

  get commands() {
    return this._jsonUnit.commands;
  }

  get entites() {
    return this._entities;
  }
}
