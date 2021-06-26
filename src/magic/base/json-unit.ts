import {
  TOKEN_MODEL,
  TOKEN_ON,
  TOKEN_ORDER_BY,
  TOKEN_PAGINATE,
  TOKEN_SELECT,
  TOKEN_SKIP,
  TOKEN_TAKE,
  TOKEN_WHERE,
} from './tokens';
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
      if (command.name?.toLowerCase() === commandName.toLowerCase()) {
        return command;
      }
    }
    return undefined;
  }

  isModel() {
    return this.key.toLowerCase() === TOKEN_MODEL;
  }

  isSelect() {
    return this.key?.toLowerCase() === TOKEN_SELECT.toLowerCase();
  }

  isOrderBy() {
    return this.key?.toLowerCase() === TOKEN_ORDER_BY.toLowerCase();
  }

  isWhere() {
    return this.key?.toLowerCase() === TOKEN_WHERE.toLowerCase();
  }

  isOn() {
    return this.key?.toLowerCase() === TOKEN_ON.toLowerCase();
  }

  getTakeCommand() {
    return this.getCommand(TOKEN_TAKE);
  }

  getSkipCommand() {
    return this.getCommand(TOKEN_SKIP);
  }

  getPaginateCommand() {
    return this.getCommand(TOKEN_PAGINATE);
  }
}
