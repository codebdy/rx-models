import { JsonUnit } from 'src/magic/base/json-unit';
import { EntityMeta } from './entity.meta';

export class RelationMetaCollection {
  private _entities: EntityMeta[] = [];
  private _ids: number[] = [];
  private _jsonUnit: JsonUnit;
  private _model: string;
  private _isSingleEntity = false;

  constructor(model: string, jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
    this._model = model;
    if (Array.isArray(jsonUnit.value)) {
      for (const meta of jsonUnit.value) {
        this.processOneElement(meta);
      }
    } else if (jsonUnit.value === null) {
    } else {
      this._isSingleEntity = true;
      this.processOneElement(jsonUnit.value);
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

  get isSingleEntity() {
    return this._isSingleEntity;
  }

  get ids() {
    return this._ids;
  }

  private processOneElement(entityOrId: any) {
    if (Number.isNaN(entityOrId)) {
      this._entities.push(new EntityMeta(this._model, entityOrId));
    } else {
      this._ids.push(entityOrId);
    }
  }
}
