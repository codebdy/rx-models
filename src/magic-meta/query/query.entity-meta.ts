import { QueryCommand } from 'src/command/query/query.command';
import { RxAbility } from 'src/entity-interface/rx-ability';
import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { createId } from 'src/util/create-id';
import { QueryRelationMeta } from '../query-old/query.relation-meta';

export class QueryEntityMeta {
  id: number;
  entityMeta: EntityMeta;
  relations: QueryRelationMeta[] = [];
  addonRelations: QueryRelationMeta[] = [];
  commands: QueryCommand[];
  //entityAbilityResult: AbilityValidateResult = false;
  //附加关联用到的字段，如果查询中不包含这些字段，需要在结果中滤除
  addonFields: string[] = [];
  //展开，对每个属性进行设置
  expandFieldForAuth = false;
  //当前登录用户，Entity对应的Abiltity
  //根据该数据，可以衍生出方法，进行权限检查
  abilities: RxAbility[] = [];

  constructor() {
    this.id = createId();
  }

  get alias() {
    return this.entityMeta.name?.toLowerCase() + this.id;
  }
}
