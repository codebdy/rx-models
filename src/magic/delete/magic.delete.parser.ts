import { JsonUnit } from '../base/json-unit';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';
export class MagicDeleteParser {
  parse(json: any) {
    const deleteMetas: DeleteMeta[] = [];
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      deleteMetas.push(new DeleteMeta(jsonUnit));
    }
    console.debug('MagicDeleteParser', deleteMetas);
    return deleteMetas;
  }
}
