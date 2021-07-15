import { CommandType } from 'src/command/command-type';
import { PostCommand } from 'src/command/post/post.command';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';

export class PostRemoveOthersCommand extends PostCommand {
  static description = `Remove records that not saved.此命令会删除POST之外的所有记录，请谨慎使用该命令`;

  static version = '1.0';

  static commandType = CommandType.POST_ENTITY_COMMAND;

  static commandName = 'removeOthers';

  //后面需要给该命令添加权限
  async afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
  ) {
    const ids = savedInstances.map((instance) => instance.id);
    //目前万能接口不支持NOT IN运算符，变通实现一下
    const querMeta = {
      entity: instanceMetaCollection.entity,
      select: ['id'],
    };
    const data = await this.magicService.query(querMeta);
    const allIds = data.data?.map((instance: { id: number }) => instance.id);
    await this.magicService.delete({
      [instanceMetaCollection.entity]: allIds.filter(
        (id: number) => !ids.find((id2) => id === id2),
      ),
    });
  }
}
