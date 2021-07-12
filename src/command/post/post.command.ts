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

  beforeSaveInstance(instanceMeta: InstanceMeta, entityManger: EntityManager) {
    return instanceMeta;
  }

  afterSaveInstance(
    savedInstance: any,
    entityName: string,
    entityManger: EntityManager,
  ) {}

  beforeUpdateRelationCollection(
    relationMetaCollection: RelationMetaCollection,
    entityManger: EntityManager,
  ) {}

  afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
    entityManger: EntityManager,
  ) {}

  afterSaveOneRelationInstanceCollection(
    savedInstances: any[],
    relationMetaCollection: RelationMetaCollection,
    entityManger: EntityManager,
  ) {}
}
