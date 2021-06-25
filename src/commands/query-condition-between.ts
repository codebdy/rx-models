import { QueryCommand } from 'src/command/query-command';

export class QueryConditionBetweenCommand extends QueryCommand {
  getWhereStatement(): { whereSql: string; params: any } {
    throw new Error('Method not implemented.');
  }
}
