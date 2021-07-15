import { getRepository } from 'typeorm';
import { JsonUnit } from '../base/json-unit';
import { MagicDeleteParser } from './magic.delete.parser';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';

export class MagicDelete {
  private _deletedModels: any;
  async delete(json: any) {
    this._deletedModels = {} as any;
    const deleteMetas = new MagicDeleteParser().parse(json);
    for (const meta of deleteMetas) {
      this._deletedModels[meta.model] = await this.deleteOne(meta);
    }
    return this._deletedModels;
  }

  private async deleteOne(meta: DeleteMeta) {
    const entityRepository = getRepository(meta.model);
    const relationMetas = entityRepository.metadata.ownRelations;
    const qb = entityRepository.createQueryBuilder(meta.model);
    meta.cascades?.forEach((relationName) => {
      qb.leftJoinAndSelect(`${meta.model}.${relationName}`, relationName);
    });
    const entites = await qb.whereInIds(meta.ids).getMany();
    const cascadeMetas: DeleteMeta[] = [];
    if (relationMetas && relationMetas.length > 0) {
      for (const entity of entites) {
        for (const relationMeta of relationMetas) {
          if (meta.isCascade(relationMeta.propertyName)) {
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
          }
          //解除所有关联关系，防止外键约束
          entity[relationMeta.propertyName] = null;
        }
        await entityRepository.save(entity);
      }
    }
    meta.ids &&
      meta.ids.length > 0 &&
      (await entityRepository.delete(meta.ids));
    for (const cascadeMeta of cascadeMetas) {
      const deletedIds = await this.deleteOne(cascadeMeta);
      this._deletedModels[cascadeMeta.model] = [
        ...(this._deletedModels[cascadeMeta.model] || []),
        ...deletedIds,
      ];
    }

    return entites.map((entity: any) => entity.id);
  }
}
