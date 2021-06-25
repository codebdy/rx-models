import { QueryConditionCommand } from 'src/command/query-condition-command';

export class QueryConditionBetweenCommand implements QueryConditionCommand {
  getWhereStatement(): { whereSql: string; params: any } {
    throw new Error('Method not implemented.');
  }
}
