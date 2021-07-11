import { Injectable } from '@nestjs/common';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { JsonUnit } from '../base/json-unit';

@Injectable()
export class MagicPostParser {
  parse(json: any) {
    const instanceMetas = [];
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      instanceMetas.push(new InstanceMetaCollection(jsonUnit.key, jsonUnit));
    }

    return instanceMetas;
  }
}
