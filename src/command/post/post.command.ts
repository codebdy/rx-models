/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
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

  beforeUpdateRelation(
    instanceMeta: InstanceMeta,
    entityName: string,
    relationName: string,
    entityManger: EntityManager,
  ) {}

  afterSaveEntityInstanceArray(
    savedInstances: any[],
    entityName: string,
    relationName: string,
    entityManger: EntityManager,
  ) {}

  afterSaveOneRelationInstanceArray(
    savedInstances: any[],
    entityName: string,
    relationName: string,
    entityManger: EntityManager,
  ) {}
}
