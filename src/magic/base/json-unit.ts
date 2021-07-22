import { TOKEN_ENTITY } from './tokens';
import { parseCommands } from './parse-commands';
import { DirectiveMeta } from 'src/directive/directive.meta';

export class JsonUnit {
  key = '';
  commands: DirectiveMeta[] = [];
  value: any;
  constructor(keyStr: string, value: any) {
    const [key, commands] = parseCommands(keyStr);
    this.key = key;
    this.commands = commands;
    this.value = value;
  }

  getCommand(directiveName: string) {
    for (const command of this.commands) {
      if (command.name === directiveName) {
        return command;
      }
    }
    return undefined;
  }

  isModel() {
    return this.key.toLowerCase() === TOKEN_ENTITY;
  }
}
