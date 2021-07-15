import { AbilityService } from 'src/ability/ability.service';
import { PostCommandService } from 'src/command/post-command.service';
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
  ) {}

  async post(json: any) {
    const savedEntites = {};
    const instances = new MagicPostParser(
      this.postCommandService,
      this.schemaService,
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
        entityManger,
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
        entityManger,
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
        entityManger,
      );
    }
    return relationCollection.isSingle ? savedInstances[0] : savedInstances;
  }

  private async saveEntity(
    instanceMeta: InstanceMeta,
    entityManger: EntityManager,
    instanceGroup: InstanceMetaCollection | RelationMetaCollection,
  ) {
    //保存前命令
    for (const command of instanceGroup.commands) {
      await command.beforeSaveInstance(instanceMeta, entityManger);
    }
    const relations = instanceMeta.relations;

    for (const relationKey in relations) {
      const relationShip: RelationMetaCollection = relations[relationKey];
      instanceMeta.savedRelations[relationKey] =
        relationShip.ids.length === 0 && relationShip.entities.length === 0
          ? null
          : await this.processRelationGroup(
              instanceMeta,
              relationShip,
              entityManger,
            );
    }
    const repository = entityManger.getRepository(instanceMeta.entity);
    let entity: any = repository.create();
    if (instanceMeta.meta?.id) {
      entity = await repository.findOne(instanceMeta.meta?.id);
    }

    for (const attrKey in instanceMeta.meta) {
      if (attrKey !== 'id') {
        entity[attrKey] = instanceMeta.meta[attrKey];
      }
    }

    for (const relationKey in instanceMeta.savedRelations) {
      const relationValue = instanceMeta.savedRelations[relationKey];
      entity[relationKey] = relationValue;
    }

    const inststance = await repository.save(entity);

    //保存后命令
    for (const command of instanceGroup.commands) {
      await command.afterSaveInstance(
        inststance,
        instanceMeta.entity,
        entityManger,
      );
    }

    return inststance;
  }
}
