import { JsonUnit } from 'src/magic/base/json-unit';
import { InstanceMeta } from './instance.meta';

export class InstanceMetaCollection {
  private _instances: InstanceMeta[] = [];
  private _jsonUnit: JsonUnit;
  private _model: string;
  private _isSingle = false;

  constructor(model: string, jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
    this._model = model;
    if (Array.isArray(jsonUnit.value)) {
      for (const meta of jsonUnit.value) {
        this._instances.push(new InstanceMeta(model, meta));
      }
    } else {
      this._isSingle = true;
      this._instances.push(new InstanceMeta(model, jsonUnit.value));
    }
  }

  get model() {
    return this._model;
  }

  get commands() {
    return this._jsonUnit.commands;
  }

  get instances() {
    return this._instances;
  }

  get isSingle() {
    return this._isSingle;
  }
}
