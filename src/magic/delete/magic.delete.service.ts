import { Injectable } from '@nestjs/common';

@Injectable()
export class MagicDeleteService {
  async delete(json: any) {
    const savedEntites = {};
    //const entities = new MagicPostParamsParser(json).entityMetas;
    //for (const entityGroup of entities) {
    //  savedEntites[entityGroup.model] = await this.saveEntityGroup(entityGroup);
    //}
    return savedEntites;
  }
}
