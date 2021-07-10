import { CommandType } from 'src/command/query/query.command';
import { QueryRelationCommand } from 'src/command/query/query.relation-command';
import { SelectQueryBuilder } from 'typeorm';

export class QueryRelationTakeCommand extends QueryRelationCommand {
  static description = `Magic query command, set take(count) to QueryBuilder.`;

  static version = '1.0';

  static commandType = CommandType.QUERY_RELATION_COMMAND;

  static commandName = 'take';

  get count() {
    return this.commandMeta.value;
  }

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    qb.take(this.count);
    return qb;
  }
}
