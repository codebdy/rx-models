import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { EntityMeta } from '../magic/post/param/entity.meta';
import { EntityMetaCollection } from '../magic/post/param/entity.meta.colletion';
import { MagicPostParamsParser } from '../magic/post/param/post.param.parser';
import { RelationMetaCollection } from '../magic/post/param/relation.meta.colletion';

@Injectable()
export class UploadService {
  async post(json: any) {
    const savedEntites = {};
    const entities = new MagicPostParamsParser(json).entityMetas;
    for (const entityGroup of entities) {
      savedEntites[entityGroup.model] = await this.saveEntityGroup(entityGroup);
    }
    return savedEntites;
  }

  private async saveEntityGroup(entityGroup: EntityMetaCollection) {
    const savedEntites = [];

    for (const entity of entityGroup.entites) {
      savedEntites.push(await this.saveEntity(entity));
    }

    return entityGroup.isSingleEntity ? savedEntites[0] : savedEntites;
  }

  private async proceRelationGroup(relationCollection: RelationMetaCollection) {
    let savedEntites = [];

    for (const entity of relationCollection.entites) {
      savedEntites.push(await this.saveEntity(entity));
    }

    if (relationCollection.ids.length > 0) {
      const repository = getRepository(relationCollection.model);
      const relationEntities = await repository.findByIds(
        relationCollection.ids,
      );
      savedEntites = savedEntites.concat(relationEntities);
    }

    return relationCollection.isSingleEntity ? savedEntites[0] : savedEntites;
  }

  private async saveEntity(entityMeta: EntityMeta) {
    const relations = entityMeta.relations;
    for (const relationKey in relations) {
      const relationShip: RelationMetaCollection = relations[relationKey];
      entityMeta.savedRelations[relationKey] =
        relationShip.ids.length === 0
          ? null
          : await this.proceRelationGroup(relationShip);
    }
    const repository = getRepository(entityMeta.model);
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
