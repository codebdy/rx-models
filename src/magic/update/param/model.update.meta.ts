import { TOKEN_IDS } from '../../base/tokens';
export class ModelUpdateMeta {
  private _ids: number[] = [];
  private _params: any = {};
  private _model = '';

  constructor(model: string, json: any) {
    this._model = model;
    for (const keyStr in json) {
      const value = json[keyStr];
      if (keyStr.trim().toLowerCase() === TOKEN_IDS) {
        this._ids = value;
      } else {
        this._params[keyStr] = value;
      }
    }
  }

  get model() {
    return this._model;
  }

  get ids() {
    return this._ids;
  }

  get params() {
    return this._params;
  }
}
