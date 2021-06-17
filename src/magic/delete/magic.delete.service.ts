import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { JsonUnit } from '../base/json-unit';
import { MagicDeleteParamsParser } from './param/delete.param.parser';
import { ModelDeleteMeta } from './param/model.delete.meta';

@Injectable()
export class MagicDeleteService {
  private _deletedModels: any;
  async delete(json: any) {
    this._deletedModels = {} as any;
    const deleteMetas = new MagicDeleteParamsParser(json).deleteMetas;
    for (const meta of deleteMetas) {
      this._deletedModels[meta.model] = await this.deleteOne(meta);
    }
    return this._deletedModels;
  }

  private async deleteOne(meta: ModelDeleteMeta) {
    const entityRepository = getRepository(meta.model);
    const relationMetas = entityRepository.metadata.ownRelations;
    const qb = entityRepository.createQueryBuilder(meta.model);
    meta.cascades?.forEach((relationName) => {
      qb.leftJoinAndSelect(`${meta.model}.${relationName}`, relationName);
    });
    const entites = await qb.whereInIds(meta.ids).getMany();
    const cascadeMetas: ModelDeleteMeta[] = [];
    if (relationMetas && relationMetas.length > 0) {
      for (const entity of entites) {
        for (const relationMeta of relationMetas) {
          if (meta.isCascade(relationMeta.propertyName)) {
            const relationObjs = entity[relationMeta.propertyName];
            relationObjs &&
              cascadeMetas.push(
                new ModelDeleteMeta(
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
