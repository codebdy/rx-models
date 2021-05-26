import { CommandMeta } from './command-meta';
import {
  TOKEN_ORDER_BY,
  TOKEN_RELATION,
  TOKEN_SELECT,
  TOKEN_SKIP,
  TOKEN_TAKE,
} from './keyword_tokens';
import { parseCommands } from './parse-commands';

export class JsonUnitMeta {
  private _key = '';
  private _commands: CommandMeta[] = [];
  private _value: any;
  constructor(keyStr: string, value: any) {
    const [key, commands] = parseCommands(keyStr);
    this._key = key;
    this._commands = commands;
    this._value = value;
  }

  get key() {
    return this._key;
  }

  get value() {
    return this._value;
  }

  get commands() {
    return this._commands;
  }

  getCommand(commandName: string) {
    for (const command of this._commands) {
      if (command.name?.toLowerCase() === commandName.toLowerCase()) {
        return command;
      }
    }
    return undefined;
  }

  isRlationShip() {
    return this.getCommand(TOKEN_RELATION);
  }

  isSelect() {
    return this._key?.toLowerCase() === TOKEN_SELECT.toLowerCase();
  }

  isOrderBy() {
    return this._key?.toLowerCase() === TOKEN_ORDER_BY.toLowerCase();
  }

  getTakeCommand() {
    return this.getCommand(TOKEN_TAKE);
  }

  getSkipCommand() {
    return this.getCommand(TOKEN_SKIP);
  }
}
