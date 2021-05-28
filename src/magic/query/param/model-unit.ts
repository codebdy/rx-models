import { JsonUnit } from './json-unit';
import { SkipCommand } from './skip-command';
import { TakeCommand } from './take-command';

export class ModelUnit {
  private _jsonUnit: JsonUnit;

  constructor(jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
  }

  get model() {
    return this._jsonUnit.value;
  }

  get modelAlias() {
    return this.model?.toLowerCase();
  }

  getTakeCommand() {
    return new TakeCommand(this._jsonUnit.getTakeCommand());
  }

  getSkipCommand() {
    return new SkipCommand(this._jsonUnit.getSkipCommand());
  }
}
