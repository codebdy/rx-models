import { CommandMeta } from '../../command/command-meta';
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

export class JsonUnit {
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

  isModel() {
    return this._key.toLowerCase() === TOKEN_MODEL;
  }

  //getRlationCommand() {
  //  return this.getCommand(TOKEN_RELATION);
  //}

  isSelect() {
    return this._key?.toLowerCase() === TOKEN_SELECT.toLowerCase();
  }

  isOrderBy() {
    return this._key?.toLowerCase() === TOKEN_ORDER_BY.toLowerCase();
  }

  isWhere() {
    return this._key?.toLowerCase() === TOKEN_WHERE.toLowerCase();
  }

  isOn() {
    return this._key?.toLowerCase() === TOKEN_ON.toLowerCase();
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
