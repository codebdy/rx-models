import { RxAbility } from 'src/entity-interface/RxAbility';
import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { RelationMetaCollection } from './relation.meta.colletion';

export class InstanceMeta {
  meta: any = {};
  relations: { [key: string]: RelationMetaCollection } = {};
  savedRelations: { [key: string]: any } = {};

  entityMeta: EntityMeta;
  //展开，对每个属性进行权限设置
  expandFieldForAuth = false;
  abilities: RxAbility[] = [];

  get entity(){
    return this.entityMeta?.name;
  }
}
