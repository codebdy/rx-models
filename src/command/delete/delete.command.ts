/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteMeta } from 'src/magic-meta/delete/delete.meta';
import { MagicService } from 'src/magic-meta/magic.service';
import { CommandMeta } from '../command.meta';

export class DeleteCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly magicService: MagicService,
  ) {}

  async beforeDelete(deleteMeta: DeleteMeta) {
    return;
  }

  async afterDelete(deletedIds: number[], deleteMeta: DeleteMeta) {}
}
