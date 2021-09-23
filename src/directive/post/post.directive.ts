/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MagicService } from 'magic-meta/magic.service';
import { InstanceMeta } from 'magic-meta/post/instance.meta';
import { InstanceMetaCollection } from 'magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'magic-meta/post/relation.meta.colletion';
import { SchemaService } from 'schema/schema.service';
import { EntityManager, EntitySchemaRelationOptions } from 'typeorm';
import { DirectiveMeta } from '../directive.meta';

export class PostDirective {
  constructor(
    protected readonly directiveMeta: DirectiveMeta,
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
