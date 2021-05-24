import { JsonUnitMeta } from './json-unit-meta';
import { TOKEN_RELATION } from './keyword_tokens';

export class RelationMeta {
  private _jsonUnit: JsonUnitMeta;

  //relations: RelationMeta[];
  //whereMeta: WhereMeta;
  constructor(jsonUnit: JsonUnitMeta) {
    this._jsonUnit = jsonUnit;
  }

  get name() {
    return this._jsonUnit.key;
  }

  get relationModel() {
    for (const command of this._jsonUnit.commands) {
      if (command.name.toLowerCase() === TOKEN_RELATION) {
        console.assert(
          command.params.length > 0,
          'Must give a relation model name',
        );
        return command.params[0];
      }
    }
    return '';
  }
}
