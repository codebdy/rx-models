import { CommandMeta } from './command-meta';
import { RelationMeta } from './relation-meta';

export class MagicQueryParamMeta {
  model: string;
  rootCommands: CommandMeta[];
  fieldCommands: {
    [key: string]: CommandMeta[];
  };
  relations: RelationMeta[];
}
