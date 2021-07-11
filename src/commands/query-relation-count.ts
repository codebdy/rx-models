import { CommandType } from 'src/command/command-type';
import { QueryRelationCommand } from 'src/command/query/query.relation-command';
import { QueryResult } from 'src/common/query-result';
import { SelectQueryBuilder } from 'typeorm';

export class QueryRelationCountCommand extends QueryRelationCommand {
  static description = `Magic query command, set relation count map to QueryBuilder.`;

  static version = '1.0';

  static commandType = CommandType.QUERY_RELATION_COMMAND;

  static commandName = 'count';

  makeQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    //queryBulider.loadRelationCountAndMap(
    //  `${paramParser.modelUnit?.modelAlias}.relationCount`,
    //  `${paramParser.modelUnit?.modelAlias}.roles`,
    //);
    return qb;
  }

  filterResult(result: QueryResult): QueryResult {
    throw new Error('Method not implemented.');
  }
}
