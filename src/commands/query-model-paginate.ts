import { CommandType } from 'src/command/magic-command';
import { QueryBuilderCommand } from 'src/command/querybuilder-command';
import { CommandMeta } from 'src/magic/base/command-meta';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelSkipCommand implements QueryBuilderCommand {
  description = `
    Magic query command, Paginate the results.
  `;
  version = '1.0';

  commandType = CommandType.QUERY_BUILDER_COMMAND;
  name = 'paginate';

  constructor(private readonly commandMeta: CommandMeta) {}

  get params() {
    return this.commandMeta.params;
  }

  get count() {
    return this.commandMeta.getFistNumberParam();
  }

  get pageSize(): number {
    return parseInt(this.commandMeta.params[0]);
  }

  get pageIndex() {
    return parseInt(this.commandMeta.params[1]);
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    console.assert(
      this.commandMeta.params.length > 0,
      'Too few pagination parmas',
    );
    qb.skip(this.pageSize * this.pageIndex).take(this.pageSize);
    return qb;
  }
}
