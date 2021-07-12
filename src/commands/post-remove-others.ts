import { CommandType } from 'src/command/command-type';
import { PostCommand } from 'src/command/post/post.command';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { EntityManager } from 'typeorm';

export class PostRemoveOthersCommand extends PostCommand {
  static description = `Remove records that not saved.此命令会删除POST之外的所有记录，请谨慎使用该命令`;

  static version = '1.0';

  static commandType = CommandType.POST_ENTITY_COMMAND;

  static commandName = 'removeOthers';

  //后面需要给该命令添加权限
  async afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
    entityManger: EntityManager,
  ) {
    await entityManger
      .createQueryBuilder()
      .delete()
      .from(instanceMetaCollection.entity)
      .where('id NOT IN (:...ids)', {
        ids: savedInstances.map((instance) => instance.id),
      })
      .execute();
  }
}
