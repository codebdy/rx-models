import { PostCommandService } from 'src/command/post-command.service';
import { RxAbility } from 'src/entity-interface/RxAbility';
import { MagicService } from 'src/magic-meta/magic.service';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { SchemaService } from 'src/schema/schema.service';
import { AbilityService } from '../ability.service';
import { JsonUnit } from '../base/json-unit';

export class MagicPostParser {
  constructor(
    private readonly commandService: PostCommandService,
    private readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
    private readonly abilityService: AbilityService,
  ) {}

  async parse(json: any) {
    const instanceMetas = [];
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      instanceMetas.push(
        await this.parseInanceMetaCollection(jsonUnit.key, jsonUnit),
      );
    }

    return instanceMetas;
  }

  private async parseInanceMetaCollection(entity: string, jsonUnit: JsonUnit) {
    const instanceCollection = new InstanceMetaCollection();
    const entityMeta = this.schemaService.getEntityMetaOrFailed(entity);
    const abilities = await this.abilityService.getEntityPostAbilities(
      entityMeta.uuid,
    );
    const expand = await this.abilityService.isEntityExpand(entityMeta.uuid);
    instanceCollection.entity = entity;
    if (Array.isArray(jsonUnit.value)) {
      for (const meta of jsonUnit.value) {
        instanceCollection.instances.push(
          await this.parseInsanceMeta(
            entity,
            meta,
            abilities,
            entityMeta,
            expand,
          ),
        );
      }
    } else {
      instanceCollection.isSingle = true;
      instanceCollection.instances.push(
        await this.parseInsanceMeta(
          entity,
          jsonUnit.value,
          abilities,
          entityMeta,
          expand,
        ),
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

  private async parseInsanceMeta(
    entity: string,
    json: any,
    abilities: RxAbility[],
    entityMeta: EntityMeta,
    expand: boolean,
  ) {
    const instanceMeta = new InstanceMeta();
    instanceMeta.abilities = abilities;
    instanceMeta.entityMeta = entityMeta;
    instanceMeta.expandFieldForAuth = expand;
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);

      const relationModel = this.schemaService.getRelationSchemaNameOrFailed(
        jsonUnit.key,
        entity,
      );
      if (relationModel) {
        instanceMeta.relations[
          jsonUnit.key
        ] = await this.parseRelationMetaCollection(relationModel, jsonUnit);
      } else {
        instanceMeta.meta[keyStr] = value;
      }
    }

    return instanceMeta;
  }

  private async parseRelationMetaCollection(
    entity: string,
    jsonUnit: JsonUnit,
  ) {
    const entityMeta = this.schemaService.getEntityMetaOrFailed(entity);
    const abilities = await this.abilityService.getEntityPostAbilities(
      entityMeta.uuid,
    );
    const expand = await this.abilityService.isEntityExpand(entityMeta.uuid);
    const relationMetaCollection = new RelationMetaCollection();
    relationMetaCollection.relationName = jsonUnit.key;
    relationMetaCollection.entity = entity;
    if (Array.isArray(jsonUnit.value)) {
      for (const meta of jsonUnit.value) {
        await this.processOneElement(
          meta,
          relationMetaCollection,
          abilities,
          entityMeta,
          expand,
        );
      }
    } else if (jsonUnit.value === null) {
    } else {
      relationMetaCollection.isSingle = true;
      await this.processOneElement(
        jsonUnit.value,
        relationMetaCollection,
        abilities,
        entityMeta,
        expand,
      );
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

  private async processOneElement(
    entityOrId: any,
    relationMetaCollection: RelationMetaCollection,
    abilities: RxAbility[],
    entityMeta: EntityMeta,
    expand: boolean,
  ) {
    if (isNaN(entityOrId)) {
      relationMetaCollection.entities.push(
        await this.parseInsanceMeta(
          relationMetaCollection.entity,
          entityOrId,
          abilities,
          entityMeta,
          expand,
        ),
      );
    } else {
      relationMetaCollection.ids.push(entityOrId);
    }
  }
}
