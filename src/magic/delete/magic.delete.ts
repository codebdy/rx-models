import { MagicDeleteParser } from './magic.delete.parser';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';
import { MagicInstanceService } from '../magic.instance.service';

export class MagicDelete {
  constructor(private readonly instanceService: MagicInstanceService) {}

  async delete(json: any) {
    const deletedInstances = {} as any;
    const deleteMetas = new MagicDeleteParser(this.instanceService).parse(json);
    for (const meta of deleteMetas) {
      deletedInstances[meta.enity] = await this.deleteOne(meta);
    }
    return deletedInstances;
  }

  private async deleteOne(meta: DeleteMeta) {
    const entityRepository = this.instanceService
      .getEntityManager()
      .getRepository(meta.enity);
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