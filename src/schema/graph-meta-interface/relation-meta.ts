/**
 * 关系类型
 */
export enum RelationType {
  INHERIT = 'inherit',
  ONE_TO_ONE = 'one-to-one',
  ONE_TO_MANY = 'one-to-many',
  MANY_TO_ONE = 'many-to-one',
  MANY_TO_MANY = 'many-to-many',
}

export enum CombinationType {
  ON_SOURCE = 'onSource',
  ON_TARGET = 'onTarget',
}

/**
 * 关系元数据
 */
export interface RelationMeta {
  /**
   * 唯一标识
   */
  uuid: string;

  /**
   * 关系类型
   */
  relationType: RelationType;

  /**
   * 关系的源实体标识
   */
  sourceId: string;

  /**
   * 关系目标源实体标识
   */
  targetId: string;

  /**
   * 源实体上的关系属性
   */
  roleOnSource?: string;

  /**
   * 目标实体上的关系属性
   */
  roleOnTarget?: string;

  /**
   * 拥有关系的实体ID，对应TypeORM的JoinTable或JoinColumn
   */
  ownerId?: string;

  combination?: CombinationType;
}
