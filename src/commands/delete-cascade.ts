import { CommandType } from 'src/command/command-type';
import { DeleteCommand } from 'src/command/delete/delete.command';
import { DeleteMeta } from 'src/magic-meta/delete/delete.meta';

export class DeleteCascadeCommand extends DeleteCommand {
  static description = `删除时，级联删除指定关联对象`;

  static version = '1.0';

  static commandType = CommandType.DELETE_COMMAND;

  static commandName = 'cascade';

  async beforeDelete(deleteMeta: DeleteMeta) {
    return;
  }

  async afterDelete(deletedIds: number[], deleteMeta: DeleteMeta) {}
}
