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
  let whereAndParams: any = {};
  for (const directive of relationMeta.directives) {
    const [whereStrAnd, paramAnd] = directive.getAndWhereStatement() || [];
    if (whereStrAnd) {
      whereAndStringArray.push(whereStrAnd);
      whereAndParams = { ...whereAndParams, ...paramAnd };
    }
    const [whereStrOr, paramOr] = directive.getOrWhereStatement() || [];
    if (whereStrOr) {
      qb.orWhere(whereStrOr, paramOr);
    }
    directive.addToQueryBuilder(qb);
  }

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
    whereAndStringArray.join(' AND '),
    { ...whereAndParams, ...params },
  );

  qb = makeRelationsBuilder(
    [...relationMeta.relations, ...relationMeta.addonRelations],
    qb,
    me,
  );
  return qb;
}
