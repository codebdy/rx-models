import { CommandType } from 'src/command/command-type';
import { PostCommand } from 'src/command/post/post.command';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { EntityManager } from 'typeorm';

export class PostRemoveOthersCommand extends PostCommand {
  static description = `Remove records that not saved.`;

  static version = '1.0';

  static commandType = CommandType.POST_ENTITY_COMMAND;

  static commandName = 'removeOthers';

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
