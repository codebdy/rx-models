import { Command } from './command';

export class TakeCommand {
  protected _commandMeta: Command;
  constructor(commandMeta: Command) {
    this._commandMeta = commandMeta;
  }

  get name() {
    return this._commandMeta.name;
  }

  get params() {
    return this._commandMeta.params;
  }

  get count() {
    return this._commandMeta.getFistNumberParam();
  }
}
