/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteMeta } from 'src/magic-meta/delete/delete.meta';
import { MagicService } from 'src/magic-meta/magic.service';
import { DirectiveMeta } from '../directive.meta';

export class DeleteDirective {
  constructor(
    protected readonly directiveMeta: DirectiveMeta,
    protected readonly magicService: MagicService,
  ) {}

  async beforeDelete(deleteMeta: DeleteMeta) {
    return;
  }

  async afterDelete(deletedIds: number[], deleteMeta: DeleteMeta) {}
}
