import { CommandMeta } from './command-meta';
import { JsonUnitMeta } from './json-unit-meta';
import { ModelUnitMeta } from './model-unit-meta';
import { parseCommands } from './parse-commands';
import { RelationMeta } from './relation-meta';
import { WhereMeta } from './where-meta';

const TOKEN_MODEL = 'model';
const TOKEN_WHERE = 'where';
const TOKEN_OR_WHERE = 'orWhere';

export class MagicQueryParamsParser {
  private json: any;
  modelUnit: ModelUnitMeta;
  takeCommand = 'getMany';
  fieldCommands: {
    [key: string]: CommandMeta[];
  };
  relations: RelationMeta[];
  whereMeta: WhereMeta;

  constructor(jsonStr: string) {
    this.json = JSON.parse(jsonStr || '{}');
    for (const keyStr in this.json) {
      const value = this.json[keyStr];
      const jsonUnit = new JsonUnitMeta(keyStr, value);
      switch (jsonUnit.key.toLowerCase()) {
        case TOKEN_MODEL:
          this.modelUnit = new ModelUnitMeta(jsonUnit);
          break;
        default:

      }
    }
  }
}
