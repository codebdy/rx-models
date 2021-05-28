import { Command } from './command';

export class SkipCommand {
  protected _commandMeta: Command;
  constructor(commandMeta: Command) {
    this._commandMeta = commandMeta;
  }

  get name() {
    return this._commandMeta.name;
  }

  get count() {
    return this._commandMeta.getFistNumberParam();
  }
}
