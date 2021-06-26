import { Injectable } from '@nestjs/common';
import { TypeOrmWithSchemaService } from 'src/typeorm-with-schema/typeorm-with-schema.service';
import { MagicQueryParser } from './magic.query.parser';
import { QueryResult } from 'src/common/query-result';

@Injectable()
export class MagicQueryService {
  constructor(
    private readonly typeormSerivce: TypeOrmWithSchemaService,
    private readonly queryParser: MagicQueryParser,
  ) {}

  async query(jsonStr: string) {
    let totalCount = 0;

    const meta = this.queryParser.parse(jsonStr);
    const qb = this.typeormSerivce
      .getRepository(meta.model)
      .createQueryBuilder(meta.alias);

    meta.addNotEffetCountCommandsToQueryBuilder(qb);

    totalCount = await qb.getCount();

    meta.addEffetCountCommandsToQueryBuilder(qb);

    console.debug(qb.getSql());
    const data = (await qb[meta.fetchString]()) as any;
    const result = { data, totalCount } as QueryResult;

    return meta.filterResult(result);
  }
}
