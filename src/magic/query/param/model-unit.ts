import { JsonUnit } from '../../base/json-unit';
import {
  TOKEN_COUNT,
  TOKEN_GET_MANY,
  TOKEN_GET_ONE,
  TOKEN_TREE,
} from '../../base/tokens';
import { PaginateCommand } from './panigate-command';
import { SkipCommand } from '../meta/skip-command';
import { TakeCommand } from '../meta/take-command';

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
    return this._jsonUnit.getTakeCommand()
      ? new TakeCommand(this._jsonUnit.getTakeCommand())
      : undefined;
  }

  getSkipCommand() {
    return this._jsonUnit.getSkipCommand()
      ? new SkipCommand(this._jsonUnit.getSkipCommand())
      : undefined;
  }

  getPaginateCommand() {
    return this._jsonUnit.getPaginateCommand()
      ? new PaginateCommand(this._jsonUnit.getPaginateCommand())
      : undefined;
  }

  needBuildTree() {
    return !!this._jsonUnit.getCommand(TOKEN_TREE);
  }

  get fetchString() {
    if (this._jsonUnit.getCommand(TOKEN_GET_ONE)) {
      return TOKEN_GET_ONE;
    }
    if (this._jsonUnit.getCommand(TOKEN_COUNT)) {
      return 'getManyAndCount';
    }
    return TOKEN_GET_MANY;
  }
}
