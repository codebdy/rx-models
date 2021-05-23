import { CommandMeta } from './command-meta';
import { WhereMeta } from './where-meta';

export class RelationMeta {
  name: string;
  model: string;
  commands: CommandMeta[];
  whereMeta: WhereMeta;
}
