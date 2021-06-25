import { CommandType } from 'src/command/magic-command';
import { QueryBuilderCommand } from 'src/command/querybuilder-command';
import { CommandMeta } from 'src/magic/base/command-meta';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelTakeCommand implements QueryBuilderCommand {
  description = `
    Magic query command, set take(count) to QueryBuilder.
  `;
  version = '1.0';

  commandType = CommandType.QUERY_BUILDER_COMMAND;
  name = 'take';

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
