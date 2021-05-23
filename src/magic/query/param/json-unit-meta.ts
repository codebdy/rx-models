import { CommandMeta } from './command-meta';

export abstract class JsonUnitMeta {
  key: string;
  commands: CommandMeta[] = [];
  constructor(key: string, commands: CommandMeta[]) {
    this.key = key;
    this.commands = commands;
  }
}
