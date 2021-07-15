import { DeleteCommand } from 'src/command/delete/delete.command';
import { JsonUnit } from 'src/magic/base/json-unit';

export class DeleteMeta {
  private _jsonUnit: JsonUnit;
  public commands: DeleteCommand[] = [];

  constructor(jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
  }

  get enity() {
    return this._jsonUnit.key;
  }

  get ids() {
    return Array.isArray(this._jsonUnit.value)
      ? this._jsonUnit.value
      : [this._jsonUnit.value];
  }

  /*get cascades() {
    const cascadeCommand = this._jsonUnit.getCommand(TOKEN_CASCADE);
    return cascadeCommand ? cascadeCommand.value : undefined;
  }

  isCascade(relationName: string) {
    if (!this.cascades) {
      return false;
    }
    for (const relation of this.cascades) {
      if (relation === relationName) {
        return true;
      }
    }

    return false;
  }*/
}
