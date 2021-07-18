import { PostCommandService } from 'src/command/post-command.service';
import { MagicService } from 'src/magic-meta/magic.service';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { SchemaService } from 'src/schema/schema.service';
import { JsonUnit } from '../base/json-unit';

export class MagicPostParser {
  constructor(
    private readonly commandService: PostCommandService,
    private readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
  ) {}

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
    jsonUnit.commands.forEach((commandMeta) => {
      const commandClass = this.commandService.findEntityCommandOrFailed(
        commandMeta.name,
      );
      instanceCollection.commands.push(
        new commandClass(commandMeta, this.magicService),
      );
    });
    return instanceCollection;
  }

  private parseInsanceMeta(entity: string, json: any) {
    const instanceMeta = new InstanceMeta();
    instanceMeta.entity = entity;
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);

      const relationModel = this.schemaService.getRelationSchemaNameOrFailed(
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
    relationMetaCollection.relationName = jsonUnit.key;
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

    jsonUnit.commands.forEach((commandMeta) => {
      const commandClass = this.commandService.findRelationCommandOrFailed(
        commandMeta.name,
      );
      relationMetaCollection.commands.push(
        new commandClass(commandMeta, this.magicService),
      );
    });
    return relationMetaCollection;
  }

  private processOneElement(
    entityOrId: any,
    relationMetaCollection: RelationMetaCollection,
  ) {
    if (isNaN(entityOrId)) {
      relationMetaCollection.entities.push(
        this.parseInsanceMeta(relationMetaCollection.entity, entityOrId),
      );
    } else {
      relationMetaCollection.ids.push(entityOrId);
    }
  }
}
