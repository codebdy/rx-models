import { RxAbility } from 'src/entity-interface/RxAbility';
import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { UpdateEntityOrRelationMeta } from './update.entity-or-relation-meta';
export class UpdateMeta {
  ids: number[] = [];
  columns: any = {};
  entityMeta: EntityMeta;
  expandFieldForAuth = false;
  abilities: RxAbility[] = [];

  rootMeta: UpdateEntityOrRelationMeta;

  get entity() {
    return this.entityMeta.name;
  }
}
