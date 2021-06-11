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
    const relationMetas = entityRepository.metadata.relations;
    const entites = await entityRepository.findByIds(meta.ids);
    const cascadeMetas: ModelDeleteMeta[] = [];
    if (relationMetas && relationMetas.length > 0) {
      for (const entity of entites) {
        //解除所有关联关系，防止外键约束
        for (const relationMeta of relationMetas) {
          if (meta.isCascade(relationMeta.propertyName)) {
            const relationObjs = entity[relationMeta.propertyName];
            cascadeMetas.push(
              new ModelDeleteMeta(
                new JsonUnit(
                  relationMeta.entityMetadata.name,
                  relationObjs && Array.isArray(relationObjs)
                    ? relationObjs.filter((obj) => obj.id)
                    : relationObjs.id,
                ),
              ),
            );
          }
          entity[relationMeta.propertyName] = null;
        }
        await entityRepository.save(entity);
      }
    }

    await entityRepository.delete(meta.ids);

    for (const cascadeMeta of cascadeMetas) {
      console.debug('cascades:', cascadeMeta);
      this._deletedModels[cascadeMeta.model] = await this.deleteOne(
        cascadeMeta,
      );
    }

    return entites.map((entity: any) => entity.id);
  }
}
