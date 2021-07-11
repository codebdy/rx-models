import { Injectable } from '@nestjs/common';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
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
    for (const instanceGroup of instances) {
      savedEntites[instanceGroup.model] = await this.saveInstanceGroup(
        instanceGroup,
      );
    }
    return savedEntites;
  }

  private async saveInstanceGroup(instanceGroup: InstanceMetaCollection) {
    const savedEntites = [];

    for (const entity of instanceGroup.instances) {
      savedEntites.push(await this.saveEntity(entity));
    }

    return instanceGroup.isSingle ? savedEntites[0] : savedEntites;
  }

  private async proceRelationGroup(relationCollection: RelationMetaCollection) {
    let savedEntites = [];

    for (const entity of relationCollection.entities) {
      savedEntites.push(await this.saveEntity(entity));
    }

    if (relationCollection.ids.length > 0) {
      const repository = this.typeormSerivce.getRepository(
        relationCollection.entity,
      );
      const relationEntities = await repository.findByIds(
        relationCollection.ids,
      );
      savedEntites = savedEntites.concat(relationEntities);
    }

    return relationCollection.isSingleEntity ? savedEntites[0] : savedEntites;
  }

  private async saveEntity(entityMeta: InstanceMeta) {
    const relations = entityMeta.relations;
    for (const relationKey in relations) {
      const relationShip: RelationMetaCollection = relations[relationKey];
      entityMeta.savedRelations[relationKey] =
        relationShip.ids.length === 0
          ? null
          : await this.proceRelationGroup(relationShip);
    }
    const repository = this.typeormSerivce.getRepository(entityMeta.entity);
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
