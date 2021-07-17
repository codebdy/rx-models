import { SelectQueryBuilder } from 'typeorm';
import { parseWhereSql } from 'src/magic-meta/query/parse-where-sql';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { RxAbility } from 'src/entity-interface/rx-ability';
import { parseRelationsFromWhereSql } from 'src/magic-meta/query/parse-relations-from-where-sql';
import { RxUser } from 'src/entity-interface/rx-user';

export function makeEntityQueryAbilityBuilder(
  ablilityReslut: RxAbility[] | true | false,
  meta: QueryEntityMeta,
  qb: SelectQueryBuilder<any>,
  me: RxUser,
) {
  const whereStringArray: string[] = [];
  let whereParams: any = {};
  if (ablilityReslut === false) {
    qb.andWhere('false');
    return qb;
  }
  //如果需要筛选
  if (ablilityReslut !== true) {
    for (const ability of ablilityReslut) {
      //如果没有表达式，则说明具有所有读权限
      const [whereStr, params] = parseWhereSql(ability.expression, meta, me);
      if (whereStr) {
        whereStringArray.push(whereStr);
        whereParams = { ...whereParams, ...params };
      }
    }
  }

  if (whereStringArray.length > 0) {
    qb.andWhere(whereStringArray.join(' OR '), whereParams);
  }
}
//取得权限用到的关联名称
export function getAbilityRelations(
  ablilityReslut: RxAbility[] | true | false,
) {
  const relatonNames: string[] = [];
  if (ablilityReslut === false) {
    return relatonNames;
  }
  if (ablilityReslut !== true) {
    for (const ability of ablilityReslut) {
      const rlNames = parseRelationsFromWhereSql(ability.expression);
      relatonNames.push(...rlNames);
    }
  }
  return relatonNames;
}
