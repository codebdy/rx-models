import { Injectable } from '@nestjs/common';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { EntityManager } from 'typeorm';
import { InstanceMeta } from '../../magic-meta/post/instance.meta';
import { MagicPostParser } from './magic.post.parser';

@Injectable()
export class MagicPostService {
  constructor(
    private readonly typeormSerivce: TypeOrmService,
    private readonly parser: MagicPostParser,
  ) {}
  async post(json: any) {
    const savedEntites = {};
    const instances = this.parser.parse(json);
    await this.typeormSerivce.connection.transaction(
      async (entityManger: EntityManager) => {
        for (const instanceGroup of instances) {
          savedEntites[instanceGroup.entity] = await this.saveInstanceGroup(
            instanceGroup,
            entityManger,
          );
        }
      },
    );

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
    relationCollection: RelationMetaCollection,
    entityManger: EntityManager,
  ) {
    for (const command of relationCollection.commands) {
      await command.beforeUpdateRelationCollection(
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
        savedInstances,
        relationCollection,
        entityManger,
      );
    }
    return relationCollection.isSingle ? savedInstances[0] : savedInstances;
  }

  private async saveEntity(
    entityMeta: InstanceMeta,
    entityManger: EntityManager,
    instanceGroup: InstanceMetaCollection | RelationMetaCollection,
  ) {
    //保存前命令
    for (const command of instanceGroup.commands) {
      await command.beforeSaveInstance(entityMeta, entityManger);
    }
    const relations = entityMeta.relations;

    for (const relationKey in relations) {
      const relationShip: RelationMetaCollection = relations[relationKey];
      entityMeta.savedRelations[relationKey] =
        relationShip.ids.length === 0 && relationShip.entities.length === 0
          ? null
          : await this.processRelationGroup(relationShip, entityManger);
    }
    const repository = entityManger.getRepository(entityMeta.entity);
    let entity: any = repository.create();
    if (entityMeta.meta?.id) {
      entity = await repository.findOne(entityMeta.meta?.id);
    }

    for (const attrKey in entityMeta.meta) {
      if (attrKey !== 'id') {
        entity[attrKey] = entityMeta.meta[attrKey];
      }
    }

    for (const relationKey in entityMeta.savedRelations) {
      const relationValue = entityMeta.savedRelations[relationKey];
      entity[relationKey] = relationValue;
    }

    const inststance = await repository.save(entity);

    //保存后命令
    for (const command of instanceGroup.commands) {
      await command.afterSaveInstance(
        inststance,
        entityMeta.entity,
        entityManger,
      );
    }

    return inststance;
  }
}
