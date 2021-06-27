import { TOKEN_MODEL } from './tokens';
import { parseCommands } from './parse-commands';
import { CommandMeta } from 'src/command/command.meta';

export class JsonUnit {
  key = '';
  commands: CommandMeta[] = [];
  value: any;
  constructor(keyStr: string, value: any) {
    const [key, commands] = parseCommands(keyStr);
    this.key = key;
    this.commands = commands;
    this.value = value;
  }

  getCommand(commandName: string) {
    for (const command of this.commands) {
      if (command.name === commandName) {
        return command;
      }
    }
    return undefined;
  }

  isModel() {
    return this.key.toLowerCase() === TOKEN_MODEL;
  }
}
