/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MagicService } from 'src/magic-meta/magic.service';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager, EntitySchemaRelationOptions } from 'typeorm';
import { CommandMeta } from '../command.meta';

export class PostCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly magicService: MagicService,
  ) {}

  async beforeSaveInstance(instanceMeta: InstanceMeta) {
    return instanceMeta;
  }

  async afterSaveInstance(savedInstance: any, entityName: string) {}

  async beforeUpdateRelationCollection(
    ownerInstanceMeta: InstanceMeta,
    relationMetaCollection: RelationMetaCollection,
  ) {}

  async afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
  ) {}

  async afterSaveOneRelationInstanceCollection(
    ownerInstanceMeta: InstanceMeta,
    savedInstances: any[],
    relationMetaCollection: RelationMetaCollection,
  ) {}
}
