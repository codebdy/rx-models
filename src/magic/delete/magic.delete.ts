import { MagicDeleteParser } from './magic.delete.parser';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';
import { AbilityService } from 'magic/ability.service';
import { EntityManager } from 'typeorm';
import { DeleteDirectiveService } from 'directive/delete-directive.service';
import { MagicService } from 'magic-meta/magic.service';
import { SchemaService } from 'schema/schema.service';
import { AbilityType } from 'entity-interface/AbilityType';

export class MagicDelete {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
    private readonly deleteDirectiveService: DeleteDirectiveService,
    public readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
  ) {}

  async delete(json: any) {
    if (this.magicService.me.isDemo) {
      throw new Error('Demo account can not delete data');
    }

    const deletedInstances = {} as any;
    const deleteMetas = await new MagicDeleteParser(
      this.deleteDirectiveService,
      this.magicService,
      this.abilityService,
      this.schemaService,
    ).parse(json);
    for (const meta of deleteMetas) {
      deletedInstances[meta.entity] = await this.deleteOne(meta);
    }
    return deletedInstances;
  }

  private getCombinationRelationNames(entityName: string) {
    const names: { roleName: string; entityName: string }[] = [];
    const entity = this.schemaService.getEntityMetaOrFailed(entityName);
    const combinationRelations =
      this.schemaService.getEntityCombinationRelationMetas(entity.uuid);
    for (const relation of combinationRelations) {
      if (relation.sourceId === entity.uuid) {
        names.push({
          roleName: relation.roleOnSource,
          entityName: this.schemaService.getEntityMetaOrFailedByUuid(
            relation.targetId,
          ).name,
        });
      }
      if (relation.targetId === entity.uuid) {
        names.push({
          roleName: relation.roleOnTarget,
          entityName: this.schemaService.getEntityMetaOrFailedByUuid(
            relation.sourceId,
          ).name,
        });
      }
    }

    return names;
  }

  private getCombinationInstancesToDelete(
    instances: any[],
    entityName: string,
  ) {
    const deleteJson = {} as any;
    const relationDatas = this.getCombinationRelationNames(entityName);
    if (relationDatas.length === 0) {
      return;
    }
    for (const relationData of relationDatas) {
      const roleName = relationData.roleName;
      const ids = [];
      for (const instance of instances) {
        const roleInstances = instance[roleName];
        if (roleInstances && roleInstances.length) {
          ids.push(...roleInstances.map((ins) => ins.id));
        } else if (roleInstances.id) {
          ids.push(roleInstances.id);
        }
      }

      if (ids.length > 0) {
        deleteJson[relationData.entityName] = ids;
      }
    }
    return Object.keys(deleteJson).length > 0 ? deleteJson : undefined;
  }

  private async deleteOne(meta: DeleteMeta) {
    if (!this.magicService.me.isSupper) {
      await this.validateDelete(meta);
    }
    const entityRepository = this.entityManager.getRepository(meta.entity);
    const relationMetas = entityRepository.metadata.ownRelations;

    const queryJson = {
      entity: meta.entity,
    } as any;

    if (meta.ids.length > 1) {
      queryJson.where = `id in (${meta.ids.join(',')})`;
    } else if (meta.ids.length === 1) {
      queryJson.id = meta.ids[0];
    } else {
      throw new Error('No data to delete');
    }

    for (const relationData of this.getCombinationRelationNames(meta.entity)) {
      queryJson[relationData.roleName] = {};
    }

    const instances = (await this.magicService.query(queryJson)).data;

    const combinationInstances = this.getCombinationInstancesToDelete(
      instances,
      meta.entity,
    );

    if (relationMetas && relationMetas.length > 0) {
      for (const instance of instances) {
        for (const relationMeta of relationMetas) {
          //解除所有关联关系，防止外键约束
          instance[relationMeta.propertyName] = null;
        }
        await entityRepository.save(instance);
      }
    }

    if (combinationInstances) {
      await this.magicService.delete(combinationInstances);
    }

    meta.ids &&
      meta.ids.length > 0 &&
      (await entityRepository.delete(meta.ids));
    return instances.map((entity: any) => entity.id);
  }

  private async validateDelete(deleteMeta: DeleteMeta) {
    const deleteEntityAbility = deleteMeta.abilities.find(
      (ability) => ability.abilityType === AbilityType.DELETE,
    );

    if (!deleteEntityAbility) {
      throw new Error(
        `${this.magicService.me.name} has not ability to delete ${deleteMeta.entity} instances`,
      );
    }

    const whereSql = deleteMeta.abilities
      .filter((ability) => ability.expression)
      .map((ability) => ability.expression)
      .join(' AND ');

    if (whereSql) {
      const queryResult = await this.magicService.query({
        entity: deleteMeta.entity,
        where: whereSql + ` and id in (${deleteMeta.ids.join(',')})`,
      });

      if (!queryResult.data?.length) {
        throw new Error(
          `${this.magicService.me.name} has not ability to delete ${
            deleteMeta.entity
          } instances:[${deleteMeta.ids.join(',')}]`,
        );
      }
    }
  }
}
