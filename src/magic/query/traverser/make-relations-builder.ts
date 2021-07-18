import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';
import { SelectQueryBuilder } from 'typeorm';

export function makeRelationsBuilder(
  relationMetas: QueryRelationMeta[],
  qb: SelectQueryBuilder<any>,
) {
  for (const relationMeta of relationMetas) {
    qb = makeOneRelationBuilder(relationMeta, qb);
  }

  return qb;
}

function makeOneRelationBuilder(
  relationMeta: QueryRelationMeta,
  qb: SelectQueryBuilder<any>,
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

  qb.leftJoinAndSelect(
    `${relationMeta.parentEntityMeta.alias}.${relationMeta.name}`,
    relationMeta.alias,
    whereStringArray.join(' AND '),
    whereParams,
  );

  qb = makeRelationsBuilder(
    [...relationMeta.relations, ...relationMeta.addonRelations],
    qb,
  );
  return qb;
}
