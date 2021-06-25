import { CommandType } from 'src/command/magic-command';
import { QueryBuilderCommand } from 'src/command/query-builder-command';
import { CommandMeta } from 'src/command/command-meta';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelSkipCommand implements QueryBuilderCommand {
  static description = `
    Magic query command, set skip(count) to QueryBuilder.
  `;
  static version = '1.0';

  static commandType = CommandType.QUERY_BUILDER_COMMAND;

  static commandName = 'skip';

  constructor(private readonly commandMeta: CommandMeta) {}

  get params() {
    return this.commandMeta.params;
  }

  get count() {
    return this.commandMeta.getFistNumberParam();
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    qb.take(this.count);
    return qb;
  }
}
