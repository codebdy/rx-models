import { SelectQueryBuilder } from 'typeorm';
import { CommandMeta } from '../../../command/command-meta';

export class SkipCommand {
  protected _commandMeta: CommandMeta;
  constructor(commandMeta: CommandMeta) {
    this._commandMeta = commandMeta;
  }

  get name() {
    return this._commandMeta.name;
  }

  get count() {
    return this._commandMeta.getFistNumberParam();
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    qb.skip(this.count);
    return qb;
  }
}
