import { SelectQueryBuilder } from 'typeorm';

export enum CommandType {
  //QUERY_BUILDER_COMMAND = 1,
  QUERY_MODEL_COMMAND = 1,
  QUERY_RELATION_COMMAND,
  QUERY_CONDITION_COMMAND,
}

export interface QueryCommand {
  /**
   * 是否需要修改QueryBuilder
   */
  isNeedToChangQueryBuilder?: boolean;

  /**
   * 是否需要构建where条件
   */
  hasWhereStatement?: boolean;

  /**
   * 是否需要过滤查询结果
   */
  shouldFilterResult?: boolean;

  /**
   * 是否影响查询结果条数，如果是，分页时需要提出该指令
   */
  isEffectResultCount?: boolean;

  /**
   * 是否需要修改数据库, 如果是在修改数据库，用于增加浏览次数，更改已读标志等功能
   */
  isMutation?: boolean;

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any>;
  getWhereStatement(): { whereSql: string; params: any };
}
