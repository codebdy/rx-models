import { RxAbility } from 'src/entity-interface/RxAbility';
import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { TOKEN_IDS } from '../../magic/base/tokens';
export class ModelUpdateMeta {
  private _ids: number[] = [];
  private _params: any = {};
  entityMeta: EntityMeta;
  expandFieldForAuth = false;
  abilities: RxAbility[] = [];

  constructor(entityMeta: EntityMeta, json: any) {
    this.entityMeta = entityMeta;
    for (const keyStr in json) {
      const value = json[keyStr];
      if (keyStr.trim().toLowerCase() === TOKEN_IDS) {
        this._ids = value;
      } else {
        this._params[keyStr] = value;
      }
    }
  }

  get ids() {
    return this._ids;
  }

  get entity() {
    return this.entityMeta.name;
  }

  get params() {
    return this._params;
  }
}
