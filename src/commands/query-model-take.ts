import { CommandType } from 'src/command/query-command';
import { QueryBuilderCommand } from 'src/command/query-builder-command';
import { SelectQueryBuilder } from 'typeorm';
import { CommandMeta } from 'src/command/command.meta';

export class QueryModelTakeCommand implements QueryBuilderCommand {
  static description = `
    Magic query command, set take(count) to QueryBuilder.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'take';

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
