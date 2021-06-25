import { SelectQueryBuilder } from 'typeorm';
import { CommandMeta } from '../../../command/command-meta';

export class PaginateCommand {
  protected _commandMeta: CommandMeta;
  constructor(commandMeta: CommandMeta) {
    this._commandMeta = commandMeta;
  }

  get pageSize(): number {
    return parseInt(this._commandMeta.params[0]);
  }

  get pageIndex() {
    return parseInt(this._commandMeta.params[1]);
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    console.assert(
      this._commandMeta.params.length > 0,
      'Too few pagination parmas',
    );
    qb.skip(this.pageSize * this.pageIndex).take(this.pageSize);
    return qb;
  }
}
