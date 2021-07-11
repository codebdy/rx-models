import { Injectable } from '@nestjs/common';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { SchemaService } from 'src/schema/schema.service';
import { JsonUnit } from '../base/json-unit';

@Injectable()
export class MagicPostParser {
  constructor(private readonly schemaService: SchemaService) {}

  parse(json: any) {
    const instanceMetas = [];
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      instanceMetas.push(
        this.parseInanceMetaCollection(jsonUnit.key, jsonUnit),
      );
    }

    return instanceMetas;
  }

  private parseInanceMetaCollection(entity: string, jsonUnit: JsonUnit) {
    const instanceCollection = new InstanceMetaCollection();
    instanceCollection.entity = entity;
    if (Array.isArray(jsonUnit.value)) {
      for (const meta of jsonUnit.value) {
        instanceCollection.instances.push(this.parseInsanceMeta(entity, meta));
      }
    } else {
      instanceCollection.isSingle = true;
      instanceCollection.instances.push(
        this.parseInsanceMeta(entity, jsonUnit.value),
      );
    }
    instanceCollection.commands = jsonUnit.commands;
    return instanceCollection;
  }

  private parseInsanceMeta(entity: string, json: any) {
    const instanceMeta = new InstanceMeta();
    instanceMeta.entity = entity;
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);

      const relationModel = this.schemaService.getRelationSchemaName(
        jsonUnit.key,
        entity,
      );
      if (relationModel) {
        instanceMeta.relations[jsonUnit.key] = this.parseRelationMetaCollection(
          relationModel,
          jsonUnit,
        );
      } else {
        instanceMeta.meta[keyStr] = value;
      }
    }

    return instanceMeta;
  }

  private parseRelationMetaCollection(entity: string, jsonUnit: JsonUnit) {
    const relationMetaCollection = new RelationMetaCollection();
    relationMetaCollection.entity = entity;
    if (Array.isArray(jsonUnit.value)) {
      for (const meta of jsonUnit.value) {
        this.processOneElement(meta, relationMetaCollection);
      }
    } else if (jsonUnit.value === null) {
    } else {
      relationMetaCollection.isSingle = true;
      this.processOneElement(jsonUnit.value, relationMetaCollection);
    }
    relationMetaCollection.commands = jsonUnit.commands;
    return relationMetaCollection;
  }

  private processOneElement(
    entityOrId: any,
    relationMetaCollection: RelationMetaCollection,
  ) {
    if (Number.isNaN(entityOrId)) {
      relationMetaCollection.entities.push(
        this.parseInsanceMeta(relationMetaCollection.entity, entityOrId),
      );
    } else {
      relationMetaCollection.ids.push(entityOrId);
    }
  }
}
