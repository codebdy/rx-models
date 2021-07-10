import { Injectable } from '@nestjs/common';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { MagicQueryParser } from './magic.query.parser';
import { QueryResult } from 'src/common/query-result';
import { TOKEN_GET_MANY } from '../base/tokens';

@Injectable()
export class MagicQueryService {
  constructor(
    private readonly typeormSerivce: TypeOrmService,
    private readonly queryParser: MagicQueryParser,
  ) {}

  async query(jsonStr: string) {
    let totalCount = 0;

    const meta = this.queryParser.parse(jsonStr);
    const qb = this.typeormSerivce
      .getRepository(meta.model)
      .createQueryBuilder(meta.alias);

    meta.makeConditionQueryBuilder(qb);
    meta.makeNotEffectCountQueryBuilder(qb);

    if (meta.fetchString === TOKEN_GET_MANY) {
      totalCount = await qb.getCount();
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
