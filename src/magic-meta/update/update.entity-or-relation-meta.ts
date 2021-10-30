import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { createId } from 'src/util/create-id';

export class UpdateEntityOrRelationMeta {
  id: number;
  entityMeta: EntityMeta;
  relations: UpdateEntityOrRelationMeta[] = [];
  parentEntityMeta: UpdateEntityOrRelationMeta;
  roleName: string;

  constructor() {
    this.id = createId();
  }

  get entity() {
    return this.entityMeta.name;
  }

  get alias() {
    return this.entityMeta.name?.toLowerCase() + this.id;
  }

  findRelation(relationName: string): UpdateEntityOrRelationMeta {
    for (const relationMeta of this.relations) {
      if (relationMeta.roleName === relationName) {
        return relationMeta;
      }
    }
  }

  /**
   *
   * @param relationString 格式relationName.otherName.otherName
   * @returns
   */
  findRelatiOrFailed(relationString: string): UpdateEntityOrRelationMeta {
    const [relationName, ...leftStrArr] = relationString.split('.');
    const leftString = leftStrArr.join('.');
    const relation = this.findRelation(relationName);
    if (relation) {
      if (leftString) {
        return relation.findRelatiOrFailed(leftString);
      }
      return relation;
    }
    throw new Error(
      `No relation ${relationString} of ${this.entity} to query meta`,
    );
  }

  addRelation(relationString: string) {
    const [relationName, ...leftStrArr] = relationString.split('.');
    const leftString = leftStrArr.join('.');
    let relation = this.findRelation(relationName);
    if (relation) {
      relation = new UpdateEntityOrRelationMeta();
      relation.parentEntityMeta = this;
      relation.roleName = relationName;
      this.relations.push(relation);
    }
    if (leftString) {
      relation.addRelation(leftString);
    }
  }
}
