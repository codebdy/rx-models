import { Injectable } from '@nestjs/common';
import { RxApp } from 'src/entity/RxApp';
import { getRepository } from 'typeorm';
import { MagicDeleteParamsParser } from './param/delete.param.parser';
import { ModelDeleteMeta } from './param/model.delete.meta';

@Injectable()
export class MagicDeleteService {
  async delete(json: any) {
    console.debug(
      'MagicDeleteService',
      getRepository(RxApp).metadata.ownRelations,
    );
    const deletedModels = {} as any;
    const deleteMetas = new MagicDeleteParamsParser(json).deleteMetas;
    for (const meta of deleteMetas) {
      deletedModels[meta.model] = await this.deleteOne(meta);
    }
    return deletedModels;
  }

  private async deleteOne(meta: ModelDeleteMeta) {
    const entityRepository = getRepository(meta.model);
    const relationMetas = entityRepository.metadata.ownRelations;
    const entites = await entityRepository.findByIds(meta.ids);
    if (relationMetas && relationMetas.length > 0) {
      for (const entity of entites) {
        //解除所有关联关系，防止外键约束
        for (const relationMeta of relationMetas) {
          entity[relationMeta.propertyName] = null;
        }
        entityRepository.save(entity);
      }
    }

    await entityRepository.delete(meta.ids);

    return entites.map((entity: any) => entity.id);
  }
}
