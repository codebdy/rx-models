/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MagicService } from 'src/magic-meta/magic.service';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { MailerSendService } from 'src/mailer/send/mailer.send.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager, EntitySchemaRelationOptions } from 'typeorm';
import { DirectiveMeta } from '../directive.meta';

export class PostDirective {
  constructor(
    protected readonly directiveMeta: DirectiveMeta,
    protected readonly magicService: MagicService,
    protected readonly mailerSendService: MailerSendService,
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
