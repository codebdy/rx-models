import { CommandType } from 'src/command/command-type';
import { PostCommand } from 'src/command/post/post.command';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { EntityManager } from 'typeorm';

export class QueryConditionEqualCommand extends PostCommand {
  static description = `Condition equal command.`;

  static version = '1.0';

  static commandType = CommandType.POST_ENTITY_COMMAND;

  static commandName = 'removeOthers';

  afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
    entityManger: EntityManager,
  ) {
    console.log('哈哈 来吧');
  }
}
