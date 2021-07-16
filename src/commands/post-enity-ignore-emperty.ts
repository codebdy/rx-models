import { CommandType } from 'src/command/command-type';
import { PostCommand } from 'src/command/post/post.command';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';

export class PostIgnorEntityEmpertyCommand extends PostCommand {
  static description = `如果为空，则忽略该字段`;

  static version = '1.0';

  static commandType = CommandType.POST_ENTITY_COMMAND;

  static commandName = 'ignoreEmperty';

  private oldRelationIds: number[] = [];

  async beforeSaveInstance(instanceMeta: InstanceMeta) {
    if (Array.isArray(this.commandMeta?.value)) {
      for (const param of this.commandMeta?.value) {
        await this.processOneField(instanceMeta, param);
      }
    } else {
      await this.processOneField(instanceMeta, this.commandMeta?.value);
    }
    return instanceMeta;
  }

  private async processOneField(instanceMeta: InstanceMeta, param: any) {
    const fieldValue = instanceMeta.meta[param];
    if (!fieldValue) {
      delete instanceMeta.meta[param];
    }
  }
}
