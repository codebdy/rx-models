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
          savedEntites[instanceGroup.model] = await this.saveInstanceGroup(
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
    const savedEntites = [];

    for (const entity of instanceGroup.instances) {
      savedEntites.push(await this.saveEntity(entity, entityManger));
    }

    return instanceGroup.isSingle ? savedEntites[0] : savedEntites;
  }

  private async processRelationGroup(
    relationCollection: RelationMetaCollection,
    entityManger: EntityManager,
  ) {
    let savedEntites = [];

    for (const entity of relationCollection.entities) {
      savedEntites.push(await this.saveEntity(entity, entityManger));
    }

    if (relationCollection.ids.length > 0) {
      const repository = entityManger.getRepository(relationCollection.entity);
      const relationEntities = await repository.findByIds(
        relationCollection.ids,
      );
      savedEntites = savedEntites.concat(relationEntities);
    }

    return relationCollection.isSingle ? savedEntites[0] : savedEntites;
  }

  private async saveEntity(
    entityMeta: InstanceMeta,
    entityManger: EntityManager,
  ) {
    const relations = entityMeta.relations;
    for (const relationKey in relations) {
      const relationShip: RelationMetaCollection = relations[relationKey];
      entityMeta.savedRelations[relationKey] =
        relationShip.ids.length === 0
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

    return await repository.save(entity);
  }
}
