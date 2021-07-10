/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryResult } from 'src/common/query-result';
import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { Connection, SelectQueryBuilder } from 'typeorm';
import { CommandMeta } from '../command.meta';

export enum CommandType {
  QUERY_MODEL_COMMAND = 1,
  QUERY_RELATION_COMMAND,
  //condition command 既可以用于Medel级别，也可以用于relation级别
  QUERY_CONDITION_COMMAND,
}

export class QueryCommand {
  /**
   * 是否影响查询结果条数，如果是，分页时需要剔除该指令来求totalCount
   */
  isEffectResultCount?: boolean;

  constructor(
    protected readonly commandMeta: CommandMeta,
    protected readonly rootMeta: QueryModelMeta,
  ) {}

  /**
   * 构建QueryBuilder
   * @param qb 用于查询数据的QueryBuilder
   * @returns 修改后的QueryBuilder
   */
  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    return qb;
  }

  /**
   * 构建条件SQL，请不要包含where
   * @returns 返回构建好的SQL语句跟参数
   */
  getWhereStatement(): [string, any] | void {
    return;
  }

  /**
   * 过滤查询结果
   * @param result 查询结果
   * @returns 过滤后的查询结果
   */
  filterResult(result: QueryResult): QueryResult {
    return result;
  }

  /**
   * 查询附带的修改操作，用于增加浏览次数，更改已读标志等功能
   * 该操作对查询结果有影响，所以在查询前调用
   * @param model 实体的类名
   * @param connection 数据库连接
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mutation(model: string, connection: Connection): void {
    return;
  }
}
