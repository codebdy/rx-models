import { JsonUnit } from 'src/magic/base/json-unit';

export class EntityMeta {
  private _entities: any = [];
  private _relations: EntityMeta[] = [];
  private _jsonUnit: JsonUnit;
  constructor(jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
  }

  get model(){
    return this._jsonUnit.key;
  }

  get commands() {
    return this._jsonUnit.commands;
  }
}
