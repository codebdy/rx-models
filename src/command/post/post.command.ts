/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager, EntitySchemaRelationOptions } from 'typeorm';
import { CommandMeta } from '../command.meta';

export class PostCommand {
  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly schemaService: SchemaService,
  ) {}

  async beforeSaveInstance(
    instanceMeta: InstanceMeta,
    entityManger: EntityManager,
  ) {
    return instanceMeta;
  }

  async afterSaveInstance(
    savedInstance: any,
    entityName: string,
    entityManger: EntityManager,
  ) {}

  async beforeUpdateRelationCollection(
    ownerInstanceMeta: InstanceMeta,
    relationMetaCollection: RelationMetaCollection,
    entityManger: EntityManager,
  ) {}

  async afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
    entityManger: EntityManager,
  ) {}

  async afterSaveOneRelationInstanceCollection(
    ownerInstanceMeta: InstanceMeta,
    savedInstances: any[],
    relationMetaCollection: RelationMetaCollection,
    entityManger: EntityManager,
  ) {}
}
