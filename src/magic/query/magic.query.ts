import { MagicQueryParser } from './magic.query.parser';
import { QueryResult } from 'src/common/query-result';
import { TOKEN_GET_MANY } from '../base/tokens';
import { MagicService } from 'src/magic-meta/magic.service';
import { AbilityService } from 'src/ability/ability.service';
import { QueryCommandService } from 'src/command/query-command.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { parseWhereSql } from 'src/magic-meta/query/parse-where-sql';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { RxAbility } from 'src/entity-interface/rx-ability';

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
    const meta = new MagicQueryParser(
      this.queryCommandService,
      this.schemaService,
      this.magicService,
    ).parse(json);

    //读权限筛查
    //const ablilityReslut = await this.abilityService.validateEntityQueryAbility(
    //  this.schemaService.getEntityMetaOrFailed(meta.entity),
    //);

    //如果没有访问权限，返回空数据
    //if (ablilityReslut === false) {
    //  return { data: [] } as QueryResult;
    //}

    const qb = this.entityManager
      .getRepository(meta.entity)
      .createQueryBuilder(meta.alias);

    //如果需要筛选
    //this.makeEntityQueryAbilityBuilder(ablilityReslut, meta, qb);

    meta.makeConditionQueryBuilder(qb);
    meta.makeNotEffectCountQueryBuilder(qb);

    if (meta.fetchString === TOKEN_GET_MANY) {
      totalCount = await qb.getCount();
      if (totalCount > 1000) {
        throw new Error('The result is too large, please use paginate command');
      }
    }

    meta.makeEffectCountQueryBuilder(qb);

    console.debug(qb.getSql());
    const data = (await qb[meta.fetchString]()) as any;

    const result =
      meta.fetchString === TOKEN_GET_MANY
        ? ({ data, totalCount } as QueryResult)
        : ({ data } as QueryResult);

    return meta.filterResult(result);
  }

  private makeEntityQueryAbilityBuilder(
    ablilityReslut: RxAbility[] | true,
    meta: QueryEntityMeta,
    qb,
  ) {
    const whereStringArray: string[] = [];
    let whereParams: any = {};
    if (ablilityReslut !== true) {
      for (const ability of ablilityReslut) {
        //如果没有表达式，则说明具有所有读权限
        const [whereStr, params] = parseWhereSql(ability.expression, meta);
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
}
