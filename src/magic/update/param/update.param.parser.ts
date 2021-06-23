import { ModelUpdateMeta } from './model.update.meta';
export class MagicUpdateParamsParser {
  private _metas: ModelUpdateMeta[] = [];

  constructor(json: any) {
    for (const keyStr in json) {
      this._metas.push(new ModelUpdateMeta(keyStr, json[keyStr]));
    }
  }

  get metas() {
    return this._metas;
  }
}
