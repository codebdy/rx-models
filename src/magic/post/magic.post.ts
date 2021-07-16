import { AbilityService } from 'src/magic/ability.service';
import { PostCommandService } from 'src/command/post-command.service';
import { MagicService } from 'src/magic-meta/magic.service';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { InstanceMeta } from '../../magic-meta/post/instance.meta';
import { MagicPostParser } from './magic.post.parser';

export class MagicPost {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
    private readonly postCommandService: PostCommandService,
    private readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
  ) {}

  async post(json: any) {
    const savedEntites = {};
    const instances = new MagicPostParser(
      this.postCommandService,
      this.schemaService,
      this.magicService,
    ).parse(json);

    for (const instanceGroup of instances) {
      savedEntites[instanceGroup.entity] = await this.saveInstanceGroup(
        instanceGroup,
        this.entityManager,
      );
    }

    return savedEntites;
  }

  private async saveInstanceGroup(
    instanceGroup: InstanceMetaCollection,
    entityManger: EntityManager,
  ) {
    const savedInstances = [];

    for (const entity of instanceGroup.instances) {
      savedInstances.push(
        await this.saveEntity(entity, entityManger, instanceGroup),
      );
    }

    for (const command of instanceGroup.commands) {
      await command.afterSaveEntityInstanceCollection(
        savedInstances,
        instanceGroup,
      );
    }
    return instanceGroup.isSingle ? savedInstances[0] : savedInstances;
  }

  private async processRelationGroup(
    instanceMeta: InstanceMeta,
    relationCollection: RelationMetaCollection,
    entityManger: EntityManager,
  ) {
    for (const command of relationCollection.commands) {
      await command.beforeUpdateRelationCollection(
        instanceMeta,
        relationCollection,
      );
    }
    let savedInstances = [];

    for (const entity of relationCollection.entities) {
      savedInstances.push(
        await this.saveEntity(entity, entityManger, relationCollection),
      );
    }

    if (relationCollection.ids.length > 0) {
      const repository = entityManger.getRepository(relationCollection.entity);
      const relationEntities = await repository.findByIds(
        relationCollection.ids,
      );
      savedInstances = savedInstances.concat(relationEntities);
    }

    for (const command of relationCollection.commands) {
      await command.afterSaveOneRelationInstanceCollection(
        instanceMeta,
        savedInstances,
        relationCollection,
      );
    }
    return relationCollection.isSingle ? savedInstances[0] : savedInstances;
  }

  private async saveEntity(
    instanceMeta: InstanceMeta,
    entityManger: EntityManager,
    instanceGroup: InstanceMetaCollection | RelationMetaCollection,
  ) {
    let filterdInstanceMeta = instanceMeta;
    //保存前命令
    for (const command of instanceGroup.commands) {
      filterdInstanceMeta = await command.beforeSaveInstance(
        filterdInstanceMeta,
      );
    }
    const relations = filterdInstanceMeta.relations;

    for (const relationKey in relations) {
      const relationShip: RelationMetaCollection = relations[relationKey];
      filterdInstanceMeta.savedRelations[relationKey] =
        relationShip.ids.length === 0 && relationShip.entities.length === 0
          ? null
          : await this.processRelationGroup(
              filterdInstanceMeta,
              relationShip,
              entityManger,
            );
    }
    const repository = entityManger.getRepository(filterdInstanceMeta.entity);
    let entity: any = repository.create();
    if (filterdInstanceMeta.meta?.id) {
      entity = await repository.findOne(filterdInstanceMeta.meta?.id);
    }

    for (const attrKey in filterdInstanceMeta.meta) {
      if (attrKey !== 'id') {
        entity[attrKey] = filterdInstanceMeta.meta[attrKey];
      }
    }

    for (const relationKey in filterdInstanceMeta.savedRelations) {
      const relationValue = filterdInstanceMeta.savedRelations[relationKey];
      entity[relationKey] = relationValue;
    }

    const inststance = await repository.save(entity);

    //保存后命令
    for (const command of instanceGroup.commands) {
      await command.afterSaveInstance(inststance, filterdInstanceMeta.entity);
    }

    return inststance;
  }
}
