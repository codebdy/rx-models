import { RxUser } from 'src/entity-interface/RxUser';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';
import { SelectQueryBuilder } from 'typeorm';
import { getEntityQueryAbilitySql } from './make-abilities-query-builder';

export function makeRelationsBuilder(
  relationMetas: QueryRelationMeta[],
  qb: SelectQueryBuilder<any>,
  me: RxUser,
) {
  for (const relationMeta of relationMetas) {
    qb = makeOneRelationBuilder(relationMeta, qb, me);
  }

  return qb;
}

function makeOneRelationBuilder(
  relationMeta: QueryRelationMeta,
  qb: SelectQueryBuilder<any>,
  me: RxUser,
) {
  const whereAndStringArray: string[] = [];
  const whereOrStringArray: string[] = [];
  let whereParams: any = {};
  for (const directive of relationMeta.directives) {
    const [whereStrAnd, paramAnd] = directive.getAndWhereStatement() || [];
    if (whereStrAnd) {
      whereAndStringArray.push(whereStrAnd);
      whereParams = { ...whereParams, ...paramAnd };
    }
    const [whereStrOr, paramOr] = directive.getOrWhereStatement() || [];
    if (whereStrOr) {
      whereOrStringArray.push(whereStrOr);
      whereParams = { ...whereParams, ...paramOr };
    }
    //if (whereStrOr) {
    //  qb.orWhere(whereStrOr, paramOr);
    //}
    directive.addToQueryBuilder(qb);
  }

  //本部分代码并未严格测试
  const orSQLString =
    whereOrStringArray.length > 0
      ? ' OR ' + whereOrStringArray.join(' OR ')
      : '';

  const [whereArray, params] = getEntityQueryAbilitySql(
    relationMeta.abilities,
    relationMeta,
    me,
  );

  if (whereArray.length > 0) {
    whereAndStringArray.push(whereArray.join(' OR '));
  }

  qb.leftJoinAndSelect(
    `${relationMeta.parentEntityMeta.alias}.${relationMeta.name}`,
    relationMeta.alias,
    whereAndStringArray.join(' AND ') + orSQLString,
    { ...whereParams, ...params },
  );

  qb = makeRelationsBuilder(
    [...relationMeta.relations, ...relationMeta.addonRelations],
    qb,
    me,
  );
  return qb;
}
