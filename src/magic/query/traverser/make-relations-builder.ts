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
  const whereStringArray: string[] = [];
  let whereParams: any = {};
  for (const command of relationMeta.commands) {
    const [whereStr, param] = command.getWhereStatement() || [];
    if (whereStr) {
      whereStringArray.push(whereStr);
      whereParams = { ...whereParams, ...param };
    }
    command.addToQueryBuilder(qb);
  }

  const [whereArray, params] = getEntityQueryAbilitySql(
    relationMeta.abilities,
    relationMeta,
    me,
  );

  whereStringArray.push(whereArray.join(' OR '));

  qb.leftJoinAndSelect(
    `${relationMeta.parentEntityMeta.alias}.${relationMeta.name}`,
    relationMeta.alias,
    whereStringArray.join(' AND '),
    { ...whereParams, ...params },
  );

  qb = makeRelationsBuilder(
    [...relationMeta.relations, ...relationMeta.addonRelations],
    qb,
    me,
  );
  return qb;
}
