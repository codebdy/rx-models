import { QueryConditionCommand } from 'src/command/query-condition-command';

export class QueryConditionBetweenCommand extends QueryConditionCommand {
  getWhereStatement(): { whereSql: string; params: any } {
    throw new Error('Method not implemented.');
  }
}
