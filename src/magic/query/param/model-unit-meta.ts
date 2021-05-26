import { JsonUnitMeta } from './json-unit-meta';
import { TOKEN_GET_MANY, TOKEN_GET_ONE } from './keyword_tokens';

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

  get takeCommand() {
    for (const command of this._jsonUnit.commands) {
      if (command.name?.toLowerCase() === TOKEN_GET_ONE.toLowerCase()) {
        return TOKEN_GET_ONE;
      }
    }
    return TOKEN_GET_MANY;
  }

  getTakeCommand() {
    return this._jsonUnit.getTakeCommand();
  }

  getSkipCommand() {
    return this._jsonUnit.getSkipCommand();
  }
}
