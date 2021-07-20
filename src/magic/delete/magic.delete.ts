import { MagicDeleteParser } from './magic.delete.parser';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';
import { AbilityService } from 'src/magic/ability.service';
import { EntityManager } from 'typeorm';
import { DeleteCommandService } from 'src/command/delete-command.service';
import { MagicService } from 'src/magic-meta/magic.service';
import { SchemaService } from 'src/schema/schema.service';
import { AbilityType } from 'src/entity-interface/AbilityType';

export class MagicDelete {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
    private readonly deleteCommandService: DeleteCommandService,
    public readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
  ) {}

  async delete(json: any) {
    if (this.magicService.me.isDemo) {
      throw new Error('Demo account can not delete data');
    }

    const deletedInstances = {} as any;
    const deleteMetas = await new MagicDeleteParser(
      this.deleteCommandService,
      this.magicService,
      this.abilityService,
      this.schemaService,
    ).parse(json);
    for (const meta of deleteMetas) {
      deletedInstances[meta.entity] = await this.deleteOne(meta);
    }
    return deletedInstances;
  }

  private async deleteOne(meta: DeleteMeta) {
    if (!this.magicService.me.isSupper) {
      await this.validateDelete(meta);
    }
    const entityRepository = this.entityManager.getRepository(meta.entity);
    const relationMetas = entityRepository.metadata.ownRelations;
    const qb = entityRepository.createQueryBuilder(meta.entity);
    const entites = await qb.whereInIds(meta.ids).getMany();
    if (relationMetas && relationMetas.length > 0) {
      for (const entity of entites) {
        for (const relationMeta of relationMetas) {
          //解除所有关联关系，防止外键约束
          entity[relationMeta.propertyName] = null;
        }
        await entityRepository.save(entity);
      }
    }
    meta.ids &&
      meta.ids.length > 0 &&
      (await entityRepository.delete(meta.ids));
    return entites.map((entity: any) => entity.id);
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
