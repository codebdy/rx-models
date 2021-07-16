import { CommandType } from 'src/command/command-type';
import { PostCommand } from 'src/command/post/post.command';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { SALT_OR_ROUNDS } from 'src/util/consts';
import * as bcrypt from 'bcrypt';

export class PostBcryptCommand extends PostCommand {
  static description = `加密一个或几个字段`;

  static version = '1.0';

  static commandType = CommandType.POST_RELATION_COMMAND;

  static commandName = 'bcrypt';

  private oldRelationIds: number[] = [];

  async beforeSaveInstance(instanceMeta: InstanceMeta) {
    if (Array.isArray(this.commandMeta?.value)) {
      for (const param of this.commandMeta?.value) {
        await this.bcryptOneField(instanceMeta, param);
      }
    } else {
      await this.bcryptOneField(instanceMeta, this.commandMeta?.value);
    }
    return instanceMeta;
  }

  private async bcryptOneField(instanceMeta: InstanceMeta, param: any) {
    const fieldValue = instanceMeta.meta[param];
    if (fieldValue) {
      instanceMeta.meta[param] = await bcrypt.hash(fieldValue, SALT_OR_ROUNDS);
    }
  }
}
