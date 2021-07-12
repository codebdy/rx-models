import { CommandType } from 'src/command/command-type';
import { PostCommand } from 'src/command/post/post.command';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { EntityManager, In, Not } from 'typeorm';

export class PostRemoveOthersCommand extends PostCommand {
  static description = `Condition equal command.`;

  static version = '1.0';

  static commandType = CommandType.POST_ENTITY_COMMAND;

  static commandName = 'removeOthers';

  async afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
    entityManger: EntityManager,
  ) {
    await entityManger.getRepository(instanceMetaCollection.entity).delete({
      where: {
        id: Not(In(savedInstances.map((instance) => instance.id))),
      },
    });
    console.log('哈哈 来吧');
  }
}
