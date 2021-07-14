import { CommandType } from 'src/command/command-type';
import { PostCommand } from 'src/command/post/post.command';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { EntityManager } from 'typeorm';

export class PostRelationCascadeCommand extends PostCommand {
  static description = `删除关联时，级联删除关联对象`;

  static version = '1.0';

  static commandType = CommandType.POST_RELATION_COMMAND;

  static commandName = 'cascade';

  //后面需要给该命令添加权限
  async afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
    entityManger: EntityManager,
  ) {

  }
}
