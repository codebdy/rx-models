import { CommandMeta } from './command-meta';

export class JsonUnitMeta {
  name: string;
  commands: CommandMeta[] = [];
  value: any;
}
