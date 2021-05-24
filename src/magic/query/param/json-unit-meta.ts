import { CommandMeta } from './command-meta';
import { TOKEN_RELATION } from './keyword_tokens';
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

  isRlationShip() {
    for (const command of this._commands) {
      if (command.name?.toLowerCase() === TOKEN_RELATION) {
        return true;
      }
    }
    return false;
  }
}
