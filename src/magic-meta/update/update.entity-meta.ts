import { RxAbility } from 'src/entity-interface/RxAbility';
import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { createId } from 'src/util/create-id';
import { UpdateRelationMeta } from './update.relation-meta';

export class UpdateEntityMeta {
  id: number;
  entityMeta: EntityMeta;
  relations: UpdateRelationMeta[] = [];

  //当前登录用户，Entity对应的Abiltity
  //根据该数据，可以衍生出方法，进行权限检查
  abilities: RxAbility[] = [];

  maxCount?: number;

  constructor() {
    this.id = createId();
  }

  get entity() {
    return this.entityMeta.name;
  }

  get alias() {
    return this.entityMeta.name?.toLowerCase() + this.id;
  }

  getHasQueryAbilityFields() {
    return this.abilities
      .filter((ability) => ability.columnUuid)
      .map((ability) => {
        return this.entityMeta.columns.find(
          (column) => column.uuid === ability.columnUuid,
        ).name;
      });
  }

  findRelation(relationName: string): UpdateRelationMeta {
    for (const relationMeta of this.relations) {
      if (relationMeta.name === relationName) {
        return relationMeta;
      }
    }
  }

  /**
   *
   * @param relationString 格式relationName.otherName.otherName
   * @returns
   */
  findRelatiOrFailed(relationString: string): UpdateRelationMeta {
    const [relationName, leftString] = relationString.split('.');
    const relation = this.findRelation(relationName);
    if (relation) {
      if (leftString) {
        return relation.findRelatiOrFailed(leftString);
      }
      return relation;
    }
    throw new Error(
      `Please add relation ${relationString} of ${this.entity} to query meta`,
    );
  }
}
