import { RxAbility } from 'src/entity-interface/RxAbility';
import { RxUser } from 'src/entity-interface/RxUser';
import { parseWhereSql } from 'src/magic-meta/query/parse-where-sql';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { SelectQueryBuilder } from 'typeorm';

export function makeAbilitiesQueryBuilder(
  meta: QueryEntityMeta,
  qb: SelectQueryBuilder<any>,
  me: RxUser,
) {
  const abilities = meta.abilities;
  if (me.isDemo || me.isSupper) {
    return qb;
  }
  //如果没有权限设置
  if (abilities.length === 0) {
    qb.andWhere('false');
    return qb;
  }
  const [whereStringArray, whereParams] = getEntityQueryAbilitySql(
    abilities,
    meta,
    me,
  );

  if (whereStringArray.length > 0) {
    qb.andWhere(whereStringArray.join(' OR '), whereParams);
  }
}

export function getEntityQueryAbilitySql(
  abilities: RxAbility[],
  meta: QueryEntityMeta,
  me: RxUser,
): [string[], any] {
  const whereStringArray: string[] = [];
  let whereParams: any = {};

  for (const ability of abilities) {
    //如果没有表达式，则说明具有所有读权限
    if (ability.can && !ability.expression) {
      return [[], {}];
    }
    const [whereStr, params] = parseWhereSql(ability.expression, meta, me);
    if (whereStr) {
      whereStringArray.push(whereStr);
      whereParams = { ...whereParams, ...params };
    }
  }

  return [whereStringArray, whereParams];
}
