import { EntityMetaCollection } from './entity.meta.colletion';

export class EntityMeta {
  private _meta: any;
  private _relations: { [key: string]: EntityMetaCollection } = {};
  private _model: string;
  private _json: any;

  constructor(model: string, json: any) {
    this._model = model;
    this._json = json;
  }
}
