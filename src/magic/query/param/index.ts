import { CommandMeta } from './command-meta';
import { RelationMeta } from './relation-meta';
import { WhereMeta } from './where-meta';

const TOKEN_MODEL = 'model';
const TOKEN_WHERE = 'where';
const TOKEN_OR_WHERE = 'orWhere';

export class MagicQueryParamsParser {
  private json: any;
  takeCommand = 'getMany';
  rootCommands: CommandMeta[];
  fieldCommands: {
    [key: string]: CommandMeta[];
  };
  relations: RelationMeta[];
  whereMeta: WhereMeta;

  constructor(jsonStr: string) {
    this.json = JSON.parse(jsonStr || '{}');
    for (const key in this.json) {
      console.log(key);
    }
  }

  get model() {
    return this.json.model?.trim();
  }

  get modelAlias() {
    return this.model?.toLowerCase();
  }
}
