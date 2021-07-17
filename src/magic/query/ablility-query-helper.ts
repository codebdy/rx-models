import { SelectQueryBuilder } from 'typeorm';
import { parseWhereSql } from 'src/magic-meta/query-old/parse-where-sql';
import { QueryEntityMeta } from 'src/magic-meta/query-old/query.entity-meta';
import { RxAbility } from 'src/entity-interface/rx-ability';
import {
  parseRelationsFromWhereSql,
} from 'src/magic-meta/query-old/parse-relations-from-where-sql';
import { AddonRelationInfo } from "src/magic-meta/query-old/addon-relation-info";
import { RxUser } from 'src/entity-interface/rx-user';
import { QueryMeta } from 'src/magic-meta/query-old/query.meta';

export function makeEntityQueryAbilityBuilder(
  ablilityReslut: RxAbility[] | true | false,
  meta: QueryEntityMeta,
  qb: SelectQueryBuilder<any>,
  me: RxUser,
) {
  if (ablilityReslut === false) {
    qb.andWhere('false');
    return qb;
  }
  const [whereStringArray, whereParams] = getEntityQueryAbilitySql(
    ablilityReslut,
    meta,
    me,
  );

  if (whereStringArray.length > 0) {
    qb.andWhere(whereStringArray.join(' OR '), whereParams);
  }
}

export function getEntityQueryAbilitySql(
  ablilityReslut: RxAbility[] | true,
  meta: QueryMeta,
  me: RxUser,
): [string[], any] {
  const whereStringArray: string[] = [];
  let whereParams: any = {};

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

  return [whereStringArray, whereParams];
}

//取得权限用到的关联信息
export function getAbilityRelations(
  ablilityReslut: RxAbility[] | true | false,
) {
  const relations: AddonRelationInfo[] = [];
  if (ablilityReslut === false) {
    return relations;
  }
  if (ablilityReslut !== true) {
    for (const ability of ablilityReslut) {
      const rlNames = parseRelationsFromWhereSql(ability.expression);
      relations.push(...rlNames);
    }
  }
  return relations;
}
