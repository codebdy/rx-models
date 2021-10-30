import { RxAbility } from 'src/entity-interface/RxAbility';
import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { TOKEN_IDS } from '../../magic/base/tokens';
import { UpdateEntityOrRelationMeta } from './update.entity-or-relation-meta';
export class UpdateMeta {
  private _ids: number[] = [];
  columns: any = {};
  entityMeta: EntityMeta;
  expandFieldForAuth = false;
  abilities: RxAbility[] = [];

  rootMeta = new UpdateEntityOrRelationMeta();

  constructor(entityMeta: EntityMeta, json: any) {
    this.entityMeta = entityMeta;
    this.rootMeta.entityMeta = entityMeta;
    for (const keyStr in json) {
      const value = json[keyStr];
      if (keyStr.trim().toLowerCase() === TOKEN_IDS) {
        this._ids = value;
      } else {
        this.columns[keyStr] = value;
      }
    }
  }

  get ids() {
    return this._ids;
  }

  get entity() {
    return this.entityMeta.name;
  }
}
