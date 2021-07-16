import { MagicDeleteParser } from './magic.delete.parser';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';
import { AbilityService } from 'src/ability/ability.service';
import { EntityManager } from 'typeorm';
import { DeleteCommandService } from 'src/command/delete-command.service';
import { MagicService } from 'src/magic-meta/magic.service';
import { SchemaService } from 'src/schema/schema.service';

export class MagicDelete {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
    private readonly deleteCommandService: DeleteCommandService,
    public readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
  ) {}

  async delete(json: any) {
    const deletedInstances = {} as any;
    const deleteMetas = new MagicDeleteParser(
      this.deleteCommandService,
      this.magicService,
    ).parse(json);
    for (const meta of deleteMetas) {
      deletedInstances[meta.enity] = await this.deleteOne(meta);
    }
    return deletedInstances;
  }

  private async deleteOne(meta: DeleteMeta) {
    const entityRepository = this.entityManager.getRepository(meta.enity);
    const relationMetas = entityRepository.metadata.ownRelations;
    const qb = entityRepository.createQueryBuilder(meta.enity);
    //meta.cascades?.forEach((relationName) => {
    //  qb.leftJoinAndSelect(`${meta.enity}.${relationName}`, relationName);
    //});
    const entites = await qb.whereInIds(meta.ids).getMany();
    //const cascadeMetas: DeleteMeta[] = [];
    if (relationMetas && relationMetas.length > 0) {
      for (const entity of entites) {
        for (const relationMeta of relationMetas) {
          /*if (meta.isCascade(relationMeta.propertyName)) {
            const relationObjs = entity[relationMeta.propertyName];
            relationObjs &&
              cascadeMetas.push(
                new DeleteMeta(
                  new JsonUnit(
                    relationMeta.inverseEntityMetadata.name,
                    Array.isArray(relationObjs)
                      ? relationObjs.filter((obj) => obj.id)
                      : relationObjs.id,
                  ),
                ),
              );
          }*/
          //解除所有关联关系，防止外键约束
          entity[relationMeta.propertyName] = null;
        }
        await entityRepository.save(entity);
      }
    }
    meta.ids &&
      meta.ids.length > 0 &&
      (await entityRepository.delete(meta.ids));
    /* for (const cascadeMeta of cascadeMetas) {
      const deletedIds = await this.deleteOne(cascadeMeta);
      this._deletedModels[cascadeMeta.enity] = [
        ...(this._deletedModels[cascadeMeta.enity] || []),
        ...deletedIds,
      ];
    }*/

    return entites.map((entity: any) => entity.id);
  }
}
