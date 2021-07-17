import { QueryRelationMeta } from './query.relation-meta';

export class QueryAddonRelationMeta extends QueryRelationMeta {
  //附加关联用到的字段，如果查询中不包含这些字段，需要在结果中滤除
  conditionFields: string[] = [];
}
