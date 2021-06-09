import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { EntityMeta } from './param/entity.meta';
import { EntityMetaCollection } from './param/entity.meta.colletion';
import { MagicPostParamsParser } from './param/post.param.parser';

@Injectable()
export class MagicPostService {
  async post(json: any) {
    const savedEntites = [];
    const entities = new MagicPostParamsParser(json).entityMetas;
    for (const entityGroup of entities) {
      savedEntites.concat(await this.saveEntityGroup(entityGroup));
    }
    return savedEntites;
  }

  private async saveEntityGroup(entityGroup: EntityMetaCollection) {
    const savedEntites = [];

    for (const entity of entityGroup.entites) {
      savedEntites.push(await this.saveEntity(entity));
    }

    return savedEntites;
  }

  private async saveEntity(entityMeta: EntityMeta) {
    const relations = entityMeta.relations;
    for (const relationKey in relations) {
      const relationShip: EntityMetaCollection = relations[relationKey];
      entityMeta.savedRelations[relationKey] = this.saveEntityGroup(
        relationShip,
      );
    }
    console.debug('saveEntity', entityMeta);
    const repository = getRepository(entityMeta.model);
    const entity = await repository.save(entityMeta.meta);
    for (const relationKey in entityMeta.savedRelations) {
      entity[relationKey] = entityMeta.savedRelations[relationKey];
    }

    return await repository.save(entity);
  }
}
