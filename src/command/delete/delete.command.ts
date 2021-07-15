/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteMeta } from 'src/magic-meta/delete/delete.meta';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { MagicInstanceService } from 'src/magic/magic.instance.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { CommandMeta } from '../command.meta';

export class DeleteCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly schemaService: SchemaService,
    protected readonly instanceService: MagicInstanceService,
  ) {}

  async beforeDelete(deleteMeta: DeleteMeta) {
    return;
  }

  async afterDelete(deletedIds: number[], deleteMeta: DeleteMeta) {}
}
