import { JsonUnit } from 'src/magic/base/json-unit';
import { EntityMetaCollection } from './entity.meta.colletion';

export class EntityMeta {
  private _meta: any = {};
  private _relations: { [key: string]: EntityMetaCollection } = {};
  private _model: string;
  private _json: any;

  constructor(model: string, json: any) {
    this._model = model;
    this._json = json;
    for (const keyStr in this._json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      const relationCommand = jsonUnit.getRlationCommand();
      if (relationCommand) {
        console.assert(
          relationCommand.params.length,
          'Must give relation model name',
        );
        this._relations[jsonUnit.key] = new EntityMetaCollection(
          relationCommand.params[0],
          jsonUnit,
        );
      } else {
        this._meta[keyStr] = value;
      }
    }
  }

  get model() {
    return this._model;
  }
}
