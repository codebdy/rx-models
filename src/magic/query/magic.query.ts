import { MagicQueryParser } from './magic.query.parser';
import { QueryResult } from 'src/common/query-result';
import { TOKEN_GET_MANY } from '../base/tokens';
import { MagicInstanceService } from '../magic.instance.service';

export class MagicQuery {
  constructor(private readonly instanceService: MagicInstanceService) {}

  async query(json: any) {
    let totalCount = 0;
    const meta = new MagicQueryParser(this.instanceService).parse(json);
    //const entityReadAbility = this.abilityService.getEntityReadAbility();
    const qb = this.instanceService
      .getEntityManager()
      .getRepository(meta.entity)
      .createQueryBuilder(meta.alias);

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
}
