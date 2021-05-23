import { CommandMeta } from './command-meta';
import { RelationMeta } from './relation-meta';
import { WhereMeta } from './where-meta';

export class MagicQueryParamMeta {
  model: string;
  rootCommands: CommandMeta[];
  fieldCommands: {
    [key: string]: CommandMeta[];
  };
  relations: RelationMeta[];
  whereMeta: WhereMeta;
}
