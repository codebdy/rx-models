import { MagicQueryParser } from './magic.query.parser';
import { QueryResult } from 'src/common/query-result';
import { TOKEN_GET_MANY } from '../base/tokens';
import { MagicService } from 'src/magic-meta/magic.service';
import { AbilityService } from 'src/magic/ability.service';
import { QueryCommandService } from 'src/command/query-command.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { JsonUnit } from '../base/json-unit';
import {
  getAbilityRelations,
  makeEntityQueryAbilityBuilder,
} from './ablility-query-helper';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';

export class MagicQuery {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
    private readonly queryCommandService: QueryCommandService,
    private readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
  ) {}

  async query(json: any) {
    let totalCount = 0;
    const parser = new MagicQueryParser(
      this.queryCommandService,
      this.schemaService,
      this.magicService,
      this.abilityService,
    );
    const meta = await parser.parse(json);

    //补足权限用到的关联
    //const relationNames = getAbilityRelations(ablilityReslut);
    //for (const relationName of relationNames) {
    //  parser.parseOneLine(new JsonUnit(relationName, {}), meta, relationName);
    //}

    const qb = this.entityManager
      .getRepository(meta.entity)
      .createQueryBuilder(meta.alias);

    meta.makeConditionQueryBuilder(qb);
    //构建用于权限筛查的QB
    //makeEntityQueryAbilityBuilder(
    //  ablilityReslut,
    //  meta,
    //  qb,
    //  this.magicService.me,
    //);

    meta.makeNotEffectCountQueryBuilder(qb);

    await makeRelationsBuilder(
      meta.relationMetas,
      qb,
      parser,
      this.abilityService,
    );

    if (meta.fetchString === TOKEN_GET_MANY) {
      totalCount = await qb.getCount();
      if (totalCount > 1000) {
        throw new Error('The result is too large, please use paginate command');
      }
    }

    meta.makeEffectCountQueryBuilder(qb);

    console.debug('SQL:', qb.getSql());
    const data = (await qb[meta.fetchString]()) as any;

    const result =
      meta.fetchString === TOKEN_GET_MANY
        ? ({ data, totalCount } as QueryResult)
        : ({ data } as QueryResult);

    return meta.filterResult(result);
  }
}

async function makeRelationsBuilder(
  relationMetas: QueryRelationMeta[],
  qb: SelectQueryBuilder<any>,
  parser: MagicQueryParser,
  abilityService: AbilityService,
) {
  for (const relationMeta of relationMetas) {
    qb = await makeOneRelationBuilder(relationMeta, qb, parser, abilityService);
  }

  return qb;
}

async function makeOneRelationBuilder(
  relationMeta: QueryRelationMeta,
  qb: SelectQueryBuilder<any>,
  parser: MagicQueryParser,
  abilityService: AbilityService,
) {
  //读权限筛查
  const ablilityReslut = await abilityService.validateEntityQueryAbility(
    relationMeta.entity,
  );
  console.debug(`${relationMeta.entity}的Read权限筛查结果：`, ablilityReslut);

  //补足权限用到的关联
  const relationNames = getAbilityRelations(ablilityReslut);
  for (const relationName of relationNames) {
    parser.parseOneLine(
      new JsonUnit(relationName, {}),
      relationMeta,
      relationName,
    );
  }

  const whereStringArray: string[] = [];
  let whereParams: any = {};
  relationMeta.relationCommands
    .concat(relationMeta.conditionCommands)
    .forEach((command) => {
      const [whereStr, param] = command.getWhereStatement() || [];
      if (whereStr) {
        whereStringArray.push(whereStr);
        whereParams = { ...whereParams, ...param };
      }

      command.addToQueryBuilder(qb);
    });
  
 // const [whereStringArray2, whereParams2] = getEntityQueryAbilitySql(
 //   ablilityReslut,
 //   relationMeta,
 //   abilityService,
 // );

  //const abilityWhere =
  //  whereStringArray2.length > 0
  //    ? ' AND (' + whereStringArray2.join(' OR ') + ')'
  //    : '';
  qb.leftJoinAndSelect(
    `${relationMeta.parentEntityMeta.alias}.${relationMeta.name}`,
    relationMeta.alias,
    whereStringArray.join(' AND '),
    whereParams,
  );

  qb = await makeRelationsBuilder(
    relationMeta.relationMetas,
    qb,
    parser,
    abilityService,
  );
  return qb;
}
