import { CommandMeta } from './command-meta';
import { RelationMeta } from './relation-meta';
import { WhereMeta } from './where-meta';

export class MagicQueryParamsParser {
  private json: any;
  rootCommands: CommandMeta[];
  fieldCommands: {
    [key: string]: CommandMeta[];
  };
  relations: RelationMeta[];
  whereMeta: WhereMeta;

  constructor(jsonStr: string) {
    this.json = JSON.parse(jsonStr || '{}');
  }

  get model() {
    return this.json.model;
  }

  get modelAlias() {
    return this.json.model.toLowerCase();
  }
}
