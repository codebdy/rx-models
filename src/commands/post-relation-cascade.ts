/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandType } from 'src/command/command-type';
import { PostCommand } from 'src/command/post/post.command';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { EntityManager } from 'typeorm';

export class PostRelationCascadeCommand extends PostCommand {
  static description = `删除关联时，级联删除关联对象`;

  static version = '1.0';

  static commandType = CommandType.POST_RELATION_COMMAND;

  static commandName = 'cascade';

  private oldRelationIds: number[] = [];

  async beforeUpdateRelationCollection(
    ownerInstanceMeta: InstanceMeta,
    relationMetaCollection: RelationMetaCollection,
  ) {
    /*const instance = await entityManger
      .getRepository(ownerInstanceMeta.entity)
      .findOne({
        id: ownerInstanceMeta.meta.id,
        relations: [relationMetaCollection.relationName],
      });
    console.log('嘿嘿，黑恶和 ', instance);*/
  }

  //后面需要给该命令添加权限
  async afterSaveOneRelationInstanceCollection(
    ownerInstanceMeta: InstanceMeta,
    savedInstances: any[],
    relationMetaCollection: RelationMetaCollection,
  ) {
    console.log('哈哈 哈哈 哈哈 哈哈 哈哈 ');
  }
}
